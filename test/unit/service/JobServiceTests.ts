const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const chai = require('chai');
const expect = chai.expect;
import { Job } from "../../../model/Job";
import JobService from "../../../service/JobService";

let jobService = new JobService();


const job: Job = {
    job_id: 1,
    job_title: "Software Engineer"
};

describe('JobService', function () {
    describe('getAllJobs', function () {
        it('should return jobs from response', async () => {
            const mock = new MockAdapter(axios);

            const data = [job];

            mock.onGet(jobService.URL).reply(200, data);

            const results = await jobService.getAllJobs();

            expect(results[0]).to.deep.equal(job);
        });

        it('should throw an exception when a 500 error is returned from axios', async () => {
            const mock = new MockAdapter(axios);

            mock.onGet(jobService.URL).reply(500);

            let error;

            try {
                await jobService.getAllJobs();
            } catch (e) {
                error = e.message;
            }

            expect(error).to.equal('Could not get jobs');
        });
    });
});
