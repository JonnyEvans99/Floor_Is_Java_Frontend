import { Application, Request, Response } from 'express';
import { Job } from '../model/Job';
import JobService from '../service/JobService';
import CapabilityService from '../service/CapabilityService';
import roleAccess from '../middleware/auth';
import UserRole from '../model/UserRole';
import { Capability } from '../model/Capability';
import JobBandService from '../service/JobBandService';
import { JobBand } from '../model/JobBand';
import { JobRequest } from '../model/JobRequest';
import getTokenRole from '../utils/getTokenRole';


module.exports = function(app: Application){

  const jobservice: JobService = new JobService();
  const jobbandservice: JobBandService = new JobBandService();
  const capabilityservice: CapabilityService = new CapabilityService();
  
  

  app.get('/jobs',roleAccess([UserRole.Admin,UserRole.User]), async (req: Request, res: Response) => {
       
    let jobs: Job[] =  [];

    try {
      jobs = await jobservice.getAllJobs();
      res.render('view-all-jobs', {
        role: getTokenRole(req.session.token),
        jobs: jobs, 
        token: req.session.token});
    } catch (error) {
      console.error(error);
    }
    
  });

  app.get('/add-job', roleAccess([UserRole.Admin]) ,async (req: Request, res: Response) => {
  
    let capabilities: Capability[] =  [];
    let jobBands: JobBand[] = [];
    try{
      capabilities = await capabilityservice.getCapabilities();
      jobBands = await jobbandservice.getJobBands();

      console.log(capabilities);
      console.log(jobBands);

      res.render('add-job', { 
        token: req.session.token,
        role: getTokenRole(req.session.token),
        capabilities: capabilities, 
        jobBands: jobBands 
      });
    } catch (error) {
      console.error(error);
    }
  });

  app.post('/add-job', roleAccess([UserRole.Admin]), async (req: Request, res: Response) => {

    // Is this correctly returning the new Job ID?
    const data: JobRequest = req.body;
    try {
      await jobservice.addJob(data);

      res.redirect('/jobs');
    }catch (e) {
      console.error(e);
      res.locals.errormessage = e.message;

      res.render('add-job', req.body);
    }
  });


};