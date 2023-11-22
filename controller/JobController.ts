import { Application, Request, Response } from 'express';
import { Job } from '../model/Job';
import JobService from '../service/JobService';
import roleAccess from '../middleware/auth';
import UserRole from '../model/UserRole';
import getTokenRole from '../utils/getTokenRole';

module.exports = function(app: Application){

  const jobservice: JobService = new JobService();
  

  app.get('/jobs',roleAccess([UserRole.Admin,UserRole.User]), async (req: Request, res: Response) => {
       
    let jobs: Job[] =  [];

    try {
      jobs = await jobservice.getAllJobs();
      res.render('view-all-jobs', {
        jobs: jobs,
        token: req.session.token,
        role: getTokenRole(req.session.token)
      });
    } catch (error) {
      console.error(error);
    }
    
  });

  app.get('/add-job',roleAccess([UserRole.Admin]), async (req: Request, res: Response) => {

    const jobBands = [
      { value: 'engineering', label: 'Engineering' },
      { value: 'platforms', label: 'Platforms' },
      { value: 'data&AI', label: 'Data & AI' },
      { value: 'qualityAssurance', label: 'Quality Assurance' },
      { value: 'cyberSecurity', label: 'Cyber Security' },
    ];

    const jobCapabilities = [
      { value: 'engineering', label: 'Apprentice' },
      { value: 'engineering', label: 'Trainee' },
      { value: 'engineering', label: 'Associate' },
      { value: 'engineering', label: 'Senior Associate' },
      { value: 'engineering', label: 'Consultant' },
      { value: 'engineering', label: 'Manager' },
      { value: 'engineering', label: 'Principle' },
      { value: 'engineering', label: 'Leadership Community' },
    ];
  
    res.render('add-job', { 
      jobBands:jobBands, 
      jobCapabilities: jobCapabilities
    });
    
  });

  app.post('/add-job',roleAccess([UserRole.Admin]), async (req: Request, res: Response) => {
    const data: Job = req.body;
    let id: number;
    try {
      id = await jobservice.addJob(data);

      res.redirect('/jobs/' + id);

    }catch (e) {
      console.error(e);
      res.locals.errormessage = e.message;

      res.render('add-job', req.body);
    }
  });


};