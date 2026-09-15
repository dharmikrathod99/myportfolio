import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    stats: {
      experienceYears: 5,
      projectsCompleted: 50,
      satisfiedClients: 42,
      pageSpeedAvgScore: 98,
      githubContributionsThisYear: 1420,
      uptimePercentage: 99.99,
      activeProjects: 4,
      serverTime: new Date().toISOString()
    }
  });
});

export default router;
