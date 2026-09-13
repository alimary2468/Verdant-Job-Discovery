import { ClientJob, ClientMatchInfo, UserProfile } from './matcherClient';

export interface JobsResponse {
  jobs: ClientJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  locations: string[];
  jobTypes: string[];
  experienceLevels: string[];
  stats?: {
    totalJobs: number;
    totalCompanies: number;
    totalLocations: number;
  };
}

export interface RecommendationItem {
  job: ClientJob;
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

export interface RecommendResponse {
  recommendations: RecommendationItem[];
  total_considered: number;
  profile: UserProfile;
}

export interface ApplyPayload {
  job_id: string;
  name: string;
  email: string;
  cover_letter: string;
}

export interface ApplyResponse {
  success: boolean;
  message: string;
  applicationId: string;
}

export interface DatasetStats {
  totalJobs: number;
  totalCompanies: number;
  totalLocations: number;
}

const API_BASE = '/api';

export async function fetchJobs(params: {
  search?: string;
  location?: string;
  type?: string;
  level?: string;
  remote?: string;
  page?: number;
  limit?: number;
}): Promise<JobsResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.location && params.location !== 'all') query.set('location', params.location);
  if (params.type && params.type !== 'all') query.set('type', params.type);
  if (params.level && params.level !== 'all') query.set('level', params.level);
  if (params.remote && params.remote !== 'all') query.set('remote', params.remote);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/jobs?${query.toString()}`);
  if (!res.ok) {
    throw new Error("We couldn't load jobs right now. Please try again.");
  }
  return res.json();
}

export async function fetchFeaturedJobs(): Promise<ClientJob[]> {
  const res = await fetch(`${API_BASE}/jobs/featured`);
  if (!res.ok) {
    throw new Error("We couldn't load featured jobs right now.");
  }
  return res.json();
}

export async function fetchJobById(id: string): Promise<ClientJob> {
  const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`);
  if (res.status === 404) {
    throw new Error('Job not found');
  }
  if (!res.ok) {
    throw new Error("We couldn't load the job details. Please try again.");
  }
  return res.json();
}

export async function fetchDatasetStats(): Promise<DatasetStats> {
  const res = await fetch(`${API_BASE}/jobs/stats`);
  if (!res.ok) {
    throw new Error("We couldn't calculate dataset stats.");
  }
  return res.json();
}

export async function getRecommendations(profile: UserProfile): Promise<RecommendResponse> {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate recommendations. Please try again.');
  }
  return res.json();
}

export async function submitApplication(payload: ApplyPayload): Promise<ApplyResponse> {
  const res = await fetch(`${API_BASE}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit application.');
  }
  return data;
}
