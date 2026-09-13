import { Router, Request, Response } from 'express';
import { getAllJobs, getDatasetStats } from '../services/jobLoader.js';

const router = Router();

// GET /api/jobs - List with search, filters, pagination
router.get('/', (req: Request, res: Response) => {
  try {
    const allJobs = getAllJobs();

    const search = ((req.query.search as string) || '').trim().toLowerCase();
    const location = ((req.query.location as string) || '').trim().toLowerCase();
    const type = ((req.query.type as string) || '').trim().toLowerCase();
    const level = ((req.query.level as string) || '').trim().toLowerCase();
    const remote = req.query.remote;
    
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string, 10) || 12));

    // Filter jobs
    let filtered = allJobs.filter(job => {
      // Search across title, company, skills, description, location, keywords
      if (search) {
        const skillsText = job.skills.join(' ').toLowerCase();
        const searchableText = `${job.title} ${job.company} ${skillsText} ${job.location} ${job.description}`.toLowerCase();
        
        // Match multiple terms if separated by spaces
        const searchTerms = search.split(/\s+/).filter(Boolean);
        const matchesAll = searchTerms.every(term => searchableText.includes(term));
        if (!matchesAll) return false;
      }

      // Location filter
      if (location && location !== 'all') {
        if (!job.location.toLowerCase().includes(location)) {
          return false;
        }
      }

      // Job Type filter (Full-time, Part-time, Contract, Internship)
      if (type && type !== 'all') {
        if (job.job_type.toLowerCase() !== type) {
          return false;
        }
      }

      // Experience Level filter (Intern, Entry, Mid, Senior)
      if (level && level !== 'all') {
        if (job.experience_level.toLowerCase() !== level) {
          return false;
        }
      }

      // Remote filter
      if (remote !== undefined && remote !== '' && remote !== 'all') {
        const isRemoteFilter = remote === 'true' || remote === '1';
        if (job.is_remote !== isRemoteFilter) {
          return false;
        }
      }

      return true;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIndex = (page - 1) * limit;
    const paginatedJobs = filtered.slice(startIndex, startIndex + limit);

    // Extract available filter values for UI
    const availableLocations = Array.from(new Set(allJobs.map(j => j.location).filter(Boolean))).sort();
    const availableTypes = Array.from(new Set(allJobs.map(j => j.job_type).filter(Boolean))).sort();
    const availableLevels = ['Intern', 'Entry', 'Mid', 'Senior'];

    const stats = getDatasetStats();

    res.json({
      jobs: paginatedJobs,
      total,
      page,
      limit,
      totalPages,
      locations: availableLocations,
      jobTypes: availableTypes,
      experienceLevels: availableLevels,
      stats
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: "We couldn't load jobs right now. Please try again." });
  }
});

// GET /api/jobs/featured - Return 6 featured opportunities
router.get('/featured', (_req: Request, res: Response) => {
  try {
    const allJobs = getAllJobs();
    // Select diverse 6 jobs: tech variety, different levels and companies
    const featured = allJobs.slice(0, 6);
    res.json(featured);
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    res.status(500).json({ error: "We couldn't load featured jobs right now." });
  }
});

// GET /api/jobs/stats - Return dataset statistics
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = getDatasetStats();
    res.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: "We couldn't calculate stats right now." });
  }
});

// GET /api/jobs/:id - Single job detail
router.get('/:id', (req: Request, res: Response) => {
  try {
    const allJobs = getAllJobs();
    const job = allJobs.find(j => j.id === req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ error: "We couldn't load the job details. Please try again." });
  }
});

export default router;
