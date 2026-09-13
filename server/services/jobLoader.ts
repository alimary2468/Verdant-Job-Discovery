import fs from 'fs';
import path from 'path';

export interface NormalizedJob {
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

let cachedNormalizedJobs: NormalizedJob[] | null = null;

/**
 * Normalizes raw LinkedIn dataset entries into a robust, standardized Job Data Model.
 * Handles variations in column names, missing fields, and type conversions.
 */
export function normalizeRawRecord(raw: any, index: number): NormalizedJob | null {
  if (!raw || typeof raw !== 'object') return null;

  // Title mapping
  const title = (
    raw.title ||
    raw.job_title ||
    raw.position ||
    raw.role ||
    'Job Opportunity'
  ).toString().trim();

  // Company mapping
  const company = (
    raw.company ||
    raw.company_name ||
    raw.employer ||
    raw.organization ||
    'Unknown company'
  ).toString().trim();

  // Location mapping
  let location = (
    raw.location ||
    raw.job_location ||
    raw.city ||
    'Location not specified'
  ).toString().trim();

  // Remote status derivation
  let is_remote = false;
  if (
    raw.is_remote === true ||
    raw.remote === true ||
    raw.work_from_home === true ||
    raw.remote_status === 'Remote' ||
    /remote|work from home|wfh/i.test(location) ||
    /remote|work from home|wfh/i.test(raw.job_type || '')
  ) {
    is_remote = true;
  }

  // Job type mapping (Full-time, Part-time, Contract, Internship)
  let rawType = (
    raw.job_type ||
    raw.employment_type ||
    raw.type ||
    'Full-time'
  ).toString().trim();
  let job_type = 'Full-time';
  if (/intern/i.test(rawType) || /intern/i.test(title)) {
    job_type = 'Internship';
  } else if (/contract/i.test(rawType)) {
    job_type = 'Contract';
  } else if (/part[\s-]?time/i.test(rawType)) {
    job_type = 'Part-time';
  } else {
    job_type = 'Full-time';
  }

  // Experience level mapping (Intern, Entry, Mid, Senior)
  let rawExp = (
    raw.experience_level ||
    raw.experience ||
    raw.level ||
    raw.seniority ||
    ''
  ).toString().trim();

  let experience_level = 'Mid';
  if (/intern/i.test(rawExp) || /intern/i.test(title) || job_type === 'Internship') {
    experience_level = 'Intern';
  } else if (/entry|junior|jr|graduate|fresh/i.test(rawExp) || /entry|junior|jr\b|fresh/i.test(title)) {
    experience_level = 'Entry';
  } else if (/senior|sr|lead|principal|architect|director|head/i.test(rawExp) || /senior|sr\b|lead|principal|architect/i.test(title)) {
    experience_level = 'Senior';
  } else {
    experience_level = 'Mid';
  }

  // Skills mapping
  let skills: string[] = [];
  if (Array.isArray(raw.skills)) {
    skills = raw.skills.map((s: any) => String(s).trim()).filter(Boolean);
  } else if (typeof raw.skills === 'string') {
    skills = raw.skills
      .split(/[,;|•\n]/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  if (skills.length === 0) {
    // If skills are missing in the dataset, extract noticeable tech keywords or use fallback
    const techKeywords = [
      'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Machine Learning',
      'Docker', 'AWS', 'PostgreSQL', 'Figma', 'Go', 'Kubernetes', 'Java', 'Data Science'
    ];
    const descText = (raw.job_description || raw.description || '') + ' ' + title;
    const found = techKeywords.filter(k => new RegExp(`\\b${k}\\b`, 'i').test(descText));
    skills = found.length > 0 ? found : ['General Technical Skills'];
  }

  // Description mapping
  const description = (
    raw.description ||
    raw.job_description ||
    raw.details ||
    raw.summary ||
    'Description unavailable'
  ).toString().trim();

  // Posted date mapping
  const posted_date = (
    raw.posted_date ||
    raw.date_posted ||
    raw.created_at ||
    '2025-01-10'
  ).toString().trim();

  // Apply URL mapping
  const apply_url = raw.apply_url && typeof raw.apply_url === 'string' && raw.apply_url.trim().startsWith('http')
    ? raw.apply_url.trim()
    : null;

  // Unique ID
  const id = String(raw.id || raw.job_id || `job-${index + 1}`);

  return {
    id,
    title,
    company,
    location,
    job_type,
    experience_level,
    skills,
    description,
    posted_date,
    apply_url,
    is_remote,
    company_size: raw.company_size || undefined,
    industry: raw.industry || undefined,
    salary_range: raw.salary_range || undefined,
  };
}

/**
 * Loads all jobs from data source, applies normalization and deduplication.
 */
export function getAllJobs(): NormalizedJob[] {
  if (cachedNormalizedJobs) {
    return cachedNormalizedJobs;
  }

  const jobsPath = path.join(process.cwd(), 'server', 'data', 'jobs.json');
  let rawData: any[] = [];

  try {
    if (fs.existsSync(jobsPath)) {
      const fileContent = fs.readFileSync(jobsPath, 'utf8');
      rawData = JSON.parse(fileContent);
    }
  } catch (err) {
    console.error('Error reading jobs dataset file:', err);
  }

  const normalizedList: NormalizedJob[] = [];
  const seenSignatures = new Set<string>();

  rawData.forEach((record, index) => {
    const job = normalizeRawRecord(record, index);
    if (!job) return;

    // Deduplication rule: same company, same title, same location
    const signature = `${job.company.toLowerCase()}|${job.title.toLowerCase()}|${job.location.toLowerCase()}`;
    if (!seenSignatures.has(signature)) {
      seenSignatures.add(signature);
      normalizedList.push(job);
    }
  });

  cachedNormalizedJobs = normalizedList;
  return cachedNormalizedJobs;
}

/**
 * Computes dataset-wide statistics.
 */
export function getDatasetStats() {
  const jobs = getAllJobs();
  const companies = new Set<string>();
  const locations = new Set<string>();

  jobs.forEach(j => {
    if (j.company && j.company !== 'Unknown company') {
      companies.add(j.company);
    }
    if (j.location && j.location !== 'Location not specified') {
      locations.add(j.location);
    }
  });

  return {
    totalJobs: jobs.length,
    totalCompanies: companies.size,
    totalLocations: locations.size,
  };
}
