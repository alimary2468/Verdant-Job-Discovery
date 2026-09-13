import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getAllJobs } from '../services/jobLoader.js';

const router = Router();

const APPLICATIONS_FILE = path.join(process.cwd(), 'server', 'data', 'applications.json');

// Helper to safely load applications
function getStoredApplications(): any[] {
  try {
    if (fs.existsSync(APPLICATIONS_FILE)) {
      const content = fs.readFileSync(APPLICATIONS_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading applications file:', err);
  }
  return [];
}

// POST /api/apply - Submit job application
router.post('/', (req: Request, res: Response) => {
  try {
    const { job_id, name, email, cover_letter } = req.body;

    // Validate job_id
    if (!job_id || typeof job_id !== 'string') {
      return res.status(400).json({ error: 'Valid Job ID is required.' });
    }

    const allJobs = getAllJobs();
    const targetJob = allJobs.find(j => j.id === job_id);
    if (!targetJob) {
      return res.status(404).json({ error: 'Selected job could not be found.' });
    }

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters.' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    // Validate cover letter
    if (!cover_letter || typeof cover_letter !== 'string' || cover_letter.trim().length < 15) {
      return res.status(400).json({ error: 'Please write a brief cover letter (at least 15 characters).' });
    }

    const applications = getStoredApplications();
    const newApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      job_id,
      job_title: targetJob.title,
      company: targetJob.company,
      name: name.trim(),
      email: email.trim(),
      cover_letter: cover_letter.trim(),
      submitted_at: new Date().toISOString()
    };

    applications.push(newApplication);

    // Save back to JSON file
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2), 'utf8');

    res.status(201).json({
      success: true,
      message: 'Application sent! 🌱',
      applicationId: newApplication.id
    });
  } catch (error) {
    console.error('Error handling application:', error);
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
});

// GET /api/apply/list - Optional endpoint to check submitted applications
router.get('/list', (_req: Request, res: Response) => {
  try {
    const apps = getStoredApplications();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Unable to retrieve applications.' });
  }
});

export default router;
