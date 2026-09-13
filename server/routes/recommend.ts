import { Router, Request, Response } from 'express';
import { getAllJobs } from '../services/jobLoader.js';
import { matchJobsForProfile, UserProfile } from '../services/matcher.js';

const router = Router();

// POST /api/recommend - Return top 10 matches for user profile
router.post('/', (req: Request, res: Response) => {
  try {
    const { skills, experience_level, education, preferred_field, name } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one skill to receive recommendations.' });
    }

    const profile: UserProfile = {
      name: typeof name === 'string' ? name.trim() : undefined,
      skills: skills.map((s: any) => String(s).trim()).filter(Boolean),
      experience_level: typeof experience_level === 'string' ? experience_level : 'Entry',
      education: typeof education === 'string' ? education.trim() : '',
      preferred_field: typeof preferred_field === 'string' ? preferred_field : 'Other'
    };

    const allJobs = getAllJobs();
    const rankedMatches = matchJobsForProfile(profile, allJobs);
    const top10 = rankedMatches.slice(0, 10);

    res.json({
      recommendations: top10,
      total_considered: allJobs.length,
      profile
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations. Please try again.' });
  }
});

export default router;
