const { postJob,getAllPostedJobs, updateJob, deleteJob } = require('../controllers/job')

const router = require('express').Router()

router.post('/',postJob);
router.get('/postedjobs',getAllPostedJobs)
router.put('/:jobId',updateJob);
router.delete('/:jobId',deleteJob)

module.exports = router