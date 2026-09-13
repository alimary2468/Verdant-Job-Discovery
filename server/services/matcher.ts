import { NormalizedJob } from './jobLoader.js';
import { normalizeSkill, SKILL_SYNONYMS } from '../utils/skillSynonyms.js';

export interface UserProfile {
  name?: string;
  skills: string[];
  experience_level: string; // 'Intern' | 'Entry' | 'Mid' | 'Senior'
  education?: string;
  preferred_field: string; // 'AI/ML' | 'Web Development' | 'Data' | 'Design' | 'Marketing' | 'Other'
}

export interface MatchResult {
  job: NormalizedJob;
  match_score: number;
  match_reason: string;
  match_details: {
    matched_skills: string[];
    skill_score: number;
    experience_score: number;
    field_score: number;
    cosine_similarity: number;
    bullet_points: string[];
  };
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some',
  'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you',
  'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenizes and normalizes text into frequency map of meaningful words.
 */
function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s+#]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

function getTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  if (tokens.length === 0) return tf;
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

/**
 * Computes Cosine Similarity using TF-IDF between user profile text and all jobs.
 */
function computeTfIdfSimilarities(
  userText: string,
  jobs: NormalizedJob[]
): number[] {
  const userTokens = tokenize(userText);
  const jobTokensList = jobs.map(j => tokenize(`${j.title} ${j.skills.join(' ')} ${j.description}`));

  const allDocsTokens = [userTokens, ...jobTokensList];
  const numDocs = allDocsTokens.length;

  // Calculate Document Frequency (DF)
  const df = new Map<string, number>();
  for (const docTokens of allDocsTokens) {
    const uniqueTokens = new Set(docTokens);
    for (const token of uniqueTokens) {
      df.set(token, (df.get(token) || 0) + 1);
    }
  }

  // Calculate IDF: ln(1 + (N / (1 + df)))
  const idf = new Map<string, number>();
  for (const [token, count] of df.entries()) {
    idf.set(token, Math.log(1 + numDocs / (1 + count)));
  }

  // Build User Vector
  const userTf = getTermFrequencies(userTokens);
  const userVector = new Map<string, number>();
  let userNormSq = 0;

  for (const [token, freq] of userTf.entries()) {
    const tfVal = freq / userTokens.length;
    const tfIdf = tfVal * (idf.get(token) || 0);
    userVector.set(token, tfIdf);
    userNormSq += tfIdf * tfIdf;
  }
  const userNorm = Math.sqrt(userNormSq);

  // Compute cosine similarity for each job
  const similarities: number[] = [];

  for (const jobTokens of jobTokensList) {
    if (jobTokens.length === 0 || userNorm === 0) {
      similarities.push(0);
      continue;
    }

    const jobTf = getTermFrequencies(jobTokens);
    let dotProduct = 0;
    let jobNormSq = 0;

    for (const [token, freq] of jobTf.entries()) {
      const tfVal = freq / jobTokens.length;
      const tfIdf = tfVal * (idf.get(token) || 0);
      jobNormSq += tfIdf * tfIdf;

      if (userVector.has(token)) {
        dotProduct += (userVector.get(token) || 0) * tfIdf;
      }
    }

    const jobNorm = Math.sqrt(jobNormSq);
    const sim = (userNorm > 0 && jobNorm > 0) ? (dotProduct / (userNorm * jobNorm)) : 0;
    similarities.push(Math.min(1, Math.max(0, sim)));
  }

  return similarities;
}

/**
 * Calculates experience alignment score (0 - 100).
 */
function calculateExperienceScore(userExp: string, jobExp: string): number {
  const normUser = (userExp || 'Mid').toLowerCase().trim();
  const normJob = (jobExp || 'Mid').toLowerCase().trim();

  const rankMap: Record<string, number> = {
    'intern': 1,
    'entry': 2,
    'mid': 3,
    'senior': 4
  };

  const uRank = rankMap[normUser] || 2;
  const jRank = rankMap[normJob] || 2;
  const diff = Math.abs(uRank - jRank);

  if (diff === 0) return 100;
  if (diff === 1) {
    // Overqualified is slightly less penalized than underqualified
    return uRank > jRank ? 85 : 75;
  }
  if (diff === 2) return 50;
  return 25;
}

/**
 * Calculates career field alignment score (0 - 100).
 */
const FIELD_KEYWORDS: Record<string, string[]> = {
  'AI/ML': [
    'ai', 'ml', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'artificial intelligence',
    'neural', 'pytorch', 'tensorflow', 'llm', 'generative ai', 'prompt', 'transformer'
  ],
  'Web Development': [
    'web', 'frontend', 'backend', 'full stack', 'fullstack', 'react', 'node', 'javascript', 'typescript',
    'html', 'css', 'vue', 'angular', 'next.js', 'express', 'django', 'api', 'tailwind'
  ],
  'Data': [
    'data', 'data science', 'data analyst', 'data engineer', 'sql', 'analytics', 'bi', 'tableau',
    'power bi', 'pandas', 'spark', 'snowflake', 'etl', 'database', 'warehouse'
  ],
  'Design': [
    'design', 'ui', 'ux', 'product design', 'figma', 'user experience', 'user interface',
    'wireframing', 'design systems', 'prototyping', 'visual design', 'creative'
  ],
  'Marketing': [
    'marketing', 'growth', 'seo', 'content', 'social media', 'campaign', 'analytics',
    'acquisition', 'copywriting', 'advertising', 'brand'
  ],
  'Other': [
    'engineering', 'systems', 'cloud', 'devops', 'security', 'product', 'qa', 'mobile'
  ]
};

function calculateFieldScore(userField: string, job: NormalizedJob): number {
  if (!userField || userField === 'Other') {
    return 70; // neutral base score
  }

  const keywords = FIELD_KEYWORDS[userField] || [];
  const targetText = `${job.title} ${job.skills.join(' ')} ${job.description} ${job.industry || ''}`.toLowerCase();

  let hits = 0;
  for (const kw of keywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(targetText)) {
      hits += 1;
    }
  }

  if (hits >= 4) return 100;
  if (hits === 3) return 90;
  if (hits === 2) return 80;
  if (hits === 1) return 65;
  return 35;
}

/**
 * Main matching algorithm combining:
 * 60% Skills (Direct skill matches + TF-IDF similarity)
 * 20% Experience
 * 20% Preferred Field
 */
export function matchJobsForProfile(
  profile: UserProfile,
  jobs: NormalizedJob[]
): MatchResult[] {
  if (!profile.skills || profile.skills.length === 0) {
    profile.skills = [];
  }

  const userSkillsNormalized = profile.skills.map(s => normalizeSkill(s));
  
  // Construct user document for TF-IDF: Boost skills by repeating them
  const userProfileDoc = [
    ...profile.skills,
    ...profile.skills, // repeated for weight
    profile.education || '',
    profile.preferred_field || '',
    profile.experience_level || ''
  ].join(' ');

  const cosineSimilarities = computeTfIdfSimilarities(userProfileDoc, jobs);

  const results: MatchResult[] = jobs.map((job, idx) => {
    // 1. Direct Skill Matching with synonyms
    const matchedSkills: string[] = [];
    const jobText = `${job.title} ${job.skills.join(' ')} ${job.description}`.toLowerCase();

    for (let i = 0; i < profile.skills.length; i++) {
      const origSkill = profile.skills[i];
      const normSkill = userSkillsNormalized[i];
      
      // Check if job skills list contains this skill or synonym
      const inJobSkills = job.skills.some(js => {
        const normJs = normalizeSkill(js);
        return normJs === normSkill || normJs.includes(normSkill) || normSkill.includes(normJs);
      });

      // Check if raw or normalized skill appears in job title/description
      const inJobText = new RegExp(`\\b${normSkill}\\b`, 'i').test(jobText) ||
                        new RegExp(`\\b${origSkill.toLowerCase()}\\b`, 'i').test(jobText);

      if (inJobSkills || inJobText) {
        matchedSkills.push(origSkill);
      }
    }

    // Skill Score (0 to 100)
    // Direct matches cover 70% of skillScore, cosine similarity covers 30%
    const directRatio = profile.skills.length > 0 ? (matchedSkills.length / profile.skills.length) : 0;
    const cosSim = cosineSimilarities[idx] || 0;
    // Cosine similarity scaled to 100 (typically ranges from 0.1 to 0.7 for document text)
    const scaledCos = Math.min(100, cosSim * 180);
    
    let skillScore = profile.skills.length > 0
      ? Math.round((directRatio * 100 * 0.70) + (scaledCos * 0.30))
      : Math.round(scaledCos * 0.8);
    skillScore = Math.min(100, Math.max(10, skillScore));

    // 2. Experience Score (20%)
    const experienceScore = calculateExperienceScore(profile.experience_level, job.experience_level);

    // 3. Field Score (20%)
    const fieldScore = calculateFieldScore(profile.preferred_field, job);

    // Final weighted score: 60% skills, 20% exp, 20% field
    const rawScore = (skillScore * 0.60) + (experienceScore * 0.20) + (fieldScore * 0.20);
    const match_score = Math.min(99, Math.max(25, Math.round(rawScore)));

    // Generate clear, personalized user-facing explanation
    const bulletPoints: string[] = [];

    if (matchedSkills.length > 0) {
      bulletPoints.push(`Matches ${matchedSkills.length} of your skills: ${matchedSkills.slice(0, 4).join(', ')}${matchedSkills.length > 4 ? ` +${matchedSkills.length - 4} more` : ''}`);
    } else {
      bulletPoints.push('This role has limited direct skill overlap with your profile, but its career field may still align with your interests.');
    }

    if (experienceScore >= 80) {
      bulletPoints.push(`Aligns with your ${profile.experience_level || 'Entry'}-level experience`);
    } else {
      bulletPoints.push(`Targeted for ${job.experience_level} seniority (You specified ${profile.experience_level || 'Entry'})`);
    }

    if (profile.preferred_field && profile.preferred_field !== 'Other') {
      if (fieldScore >= 70) {
        bulletPoints.push(`Fits your ${profile.preferred_field} career preference`);
      } else {
        bulletPoints.push(`Broadens opportunities beyond your preferred ${profile.preferred_field} field`);
      }
    }

    const match_reason = bulletPoints.map(b => (b.startsWith('This role') ? b : `✓ ${b}`)).join('. ') + '.';

    return {
      job,
      match_score,
      match_reason,
      match_details: {
        matched_skills: matchedSkills,
        skill_score: skillScore,
        experience_score: experienceScore,
        field_score: fieldScore,
        cosine_similarity: Number(cosSim.toFixed(3)),
        bullet_points: bulletPoints
      }
    };
  });

  // Sort descending by match_score
  return results.sort((a, b) => b.match_score - a.match_score);
}
