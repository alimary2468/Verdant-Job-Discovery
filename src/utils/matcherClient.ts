import { normalizeSkill } from './skillSynonyms';

export interface UserProfile {
  name?: string;
  skills: string[];
  experience_level: string;
  education?: string;
  preferred_field: string;
}

export interface ClientJob {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  experience_level: string;
  skills: string[];
  description: string;
  posted_date: string;
  apply_url: string | null;
  is_remote: boolean;
  company_size?: string;
  industry?: string;
  salary_range?: string;
}

export interface ClientMatchInfo {
  match_score: number;
  match_reason: string;
  matched_skills: string[];
  bullet_points: string[];
}

const FIELD_KEYWORDS: Record<string, string[]> = {
  'AI/ML': [
    'ai', 'ml', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'artificial intelligence',
    'neural', 'pytorch', 'tensorflow', 'llm', 'generative ai', 'prompt'
  ],
  'Web Development': [
    'web', 'frontend', 'backend', 'full stack', 'react', 'node', 'javascript', 'typescript',
    'html', 'css', 'vue', 'angular', 'next.js', 'express', 'django', 'api', 'tailwind'
  ],
  'Data': [
    'data', 'data science', 'data analyst', 'data engineer', 'sql', 'analytics', 'bi', 'tableau',
    'power bi', 'pandas', 'spark', 'snowflake', 'database'
  ],
  'Design': [
    'design', 'ui', 'ux', 'product design', 'figma', 'user experience', 'user interface',
    'wireframing', 'design systems', 'prototyping'
  ],
  'Marketing': [
    'marketing', 'growth', 'seo', 'content', 'social media', 'campaign', 'analytics',
    'acquisition', 'copywriting', 'advertising'
  ],
  'Other': [
    'engineering', 'systems', 'cloud', 'devops', 'security', 'mobile'
  ]
};

function calculateExpScore(userExp: string, jobExp: string): number {
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
  if (diff === 1) return uRank > jRank ? 85 : 75;
  if (diff === 2) return 50;
  return 25;
}

function calculateFieldScore(userField: string, job: ClientJob): number {
  if (!userField || userField === 'Other') return 70;
  const keywords = FIELD_KEYWORDS[userField] || [];
  const targetText = `${job.title} ${job.skills.join(' ')} ${job.description} ${job.industry || ''}`.toLowerCase();

  let hits = 0;
  for (const kw of keywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(targetText)) hits += 1;
  }

  if (hits >= 4) return 100;
  if (hits === 3) return 90;
  if (hits === 2) return 80;
  if (hits === 1) return 65;
  return 35;
}

export function evaluateJobMatch(job: ClientJob, profile: UserProfile | null): ClientMatchInfo | null {
  if (!profile || !profile.skills || profile.skills.length === 0) {
    return null;
  }

  const userSkillsNorm = profile.skills.map(s => normalizeSkill(s));
  const jobText = `${job.title} ${job.skills.join(' ')} ${job.description}`.toLowerCase();
  const matchedSkills: string[] = [];

  for (let i = 0; i < profile.skills.length; i++) {
    const orig = profile.skills[i];
    const norm = userSkillsNorm[i];

    const inJobSkills = job.skills.some(js => {
      const normJs = normalizeSkill(js);
      return normJs === norm || normJs.includes(norm) || norm.includes(normJs);
    });

    const inJobText = new RegExp(`\\b${norm}\\b`, 'i').test(jobText) ||
                      new RegExp(`\\b${orig.toLowerCase()}\\b`, 'i').test(jobText);

    if (inJobSkills || inJobText) {
      matchedSkills.push(orig);
    }
  }

  const directRatio = profile.skills.length > 0 ? (matchedSkills.length / profile.skills.length) : 0;
  let skillScore = Math.round(directRatio * 100);
  skillScore = Math.min(100, Math.max(15, skillScore));

  const expScore = calculateExpScore(profile.experience_level, job.experience_level);
  const fieldScore = calculateFieldScore(profile.preferred_field, job);

  const rawScore = (skillScore * 0.60) + (expScore * 0.20) + (fieldScore * 0.20);
  const match_score = Math.min(99, Math.max(25, Math.round(rawScore)));

  const bullet_points: string[] = [];
  if (matchedSkills.length > 0) {
    bullet_points.push(`Matches ${matchedSkills.length} of your skills: ${matchedSkills.slice(0, 4).join(', ')}${matchedSkills.length > 4 ? ` +${matchedSkills.length - 4} more` : ''}`);
  } else {
    bullet_points.push('This role has limited direct skill overlap with your profile, but its career field may still align with your interests.');
  }

  if (expScore >= 80) {
    bullet_points.push(`Aligns with your ${profile.experience_level || 'Entry'}-level experience`);
  } else {
    bullet_points.push(`Targeted for ${job.experience_level} seniority`);
  }

  if (profile.preferred_field && profile.preferred_field !== 'Other') {
    if (fieldScore >= 70) {
      bullet_points.push(`Fits your ${profile.preferred_field} career preference`);
    }
  }

  const match_reason = bullet_points.map(b => (b.startsWith('This role') ? b : `✓ ${b}`)).join('. ') + '.';

  return {
    match_score,
    match_reason,
    matched_skills: matchedSkills,
    bullet_points
  };
}
