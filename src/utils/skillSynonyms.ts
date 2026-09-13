/**
 * Skill synonyms and normalization dictionary.
 * Helps recognize equivalent skills across varying job postings and user inputs.
 */

export const SKILL_SYNONYMS: Record<string, string> = {
  // AI / ML / Data Science
  'ml': 'machine learning',
  'ai': 'artificial intelligence',
  'dl': 'deep learning',
  'nlp': 'natural language processing',
  'cv': 'computer vision',
  'genai': 'generative ai',
  'llm': 'large language models',
  'llms': 'large language models',
  'tf': 'tensorflow',
  'torch': 'pytorch',
  'sklearn': 'scikit-learn',
  'data sci': 'data science',
  'bi': 'business intelligence',
  'etl': 'extract transform load',
  'eda': 'exploratory data analysis',

  // Web & Frontend
  'js': 'javascript',
  'ts': 'typescript',
  'reactjs': 'react',
  'react.js': 'react',
  'vuejs': 'vue',
  'vue.js': 'vue',
  'angularjs': 'angular',
  'next': 'next.js',
  'nextjs': 'next.js',
  'nuxt': 'nuxt.js',
  'nuxtjs': 'nuxt.js',
  'node': 'node.js',
  'nodejs': 'node.js',
  'expressjs': 'express',
  'tailwind': 'tailwind css',
  'tailwindcss': 'tailwind css',
  'html5': 'html',
  'css3': 'css',

  // Backend & Languages
  'py': 'python',
  'python3': 'python',
  'c++': 'cpp',
  'c#': 'csharp',
  'golang': 'go',
  'ruby on rails': 'rails',
  'ror': 'rails',
  'springboot': 'spring boot',
  'spring': 'spring framework',

  // Databases & Cloud
  'postgres': 'postgresql',
  'psql': 'postgresql',
  'mongo': 'mongodb',
  'k8s': 'kubernetes',
  'aws': 'amazon web services',
  'gcp': 'google cloud platform',
  'azure': 'microsoft azure',
  'docker': 'docker containerization',
  'ci/cd': 'cicd',
  'continuous integration': 'cicd',

  // Design & UX
  'ui/ux': 'ui ux design',
  'ui': 'user interface',
  'ux': 'user experience',
  'figma': 'figma design',

  // Mobile
  'rn': 'react native',
  'react-native': 'react native',
  'flutter': 'flutter mobile',
  'ios': 'ios development',
  'android': 'android development'
};

/**
 * Normalizes a skill string: lowercased, trimmed, stripped of punctuation,
 * and mapped through the synonym dictionary if available.
 */
export function normalizeSkill(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  
  // Clean whitespace & common formatting symbols
  let cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/[._\-]+/g, ' ')
    .replace(/\s+/g, ' ');

  // Check direct alias mapping
  if (SKILL_SYNONYMS[cleaned]) {
    return SKILL_SYNONYMS[cleaned];
  }

  // Check raw original lowercase (for things like 'c++' or 'c#')
  const originalLower = raw.toLowerCase().trim();
  if (SKILL_SYNONYMS[originalLower]) {
    return SKILL_SYNONYMS[originalLower];
  }

  return cleaned;
}
