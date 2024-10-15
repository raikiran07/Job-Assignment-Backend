const Jobs = require('../models/Jobs')
const sendJobNotification = require('../utils/sendJobAlert')

const postJob = async (req,res) => {
    try {
       
        console.log("job post")
        const user = req.user
        console.log(user)
        if(!user.emailVerified || !user.phoneVerified){
            return res.status(401).json({msg:"Please verify your account"})
        }
        const job = await Jobs.create({
            ...req.body,
            company:user.userId
        })

        if(!job){
            return res.status(500).json({msg:"Internal Server Error"})
        }

        // sending job notification to candidates if email is provided
        const candidatesEmail = req.body?.candidates
        

        //send job alert notification to candidate emails
        if(candidatesEmail.length > 0){
            const message = req?.body?.description
            await sendJobNotification(user.email,candidatesEmail,`Job Notification Alert - ${req.body.title}`,message);
        }

        

        res.status(201).json({msg:"job posted successfully"})
        
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}


const getAllPostedJobs = async (req,res) => {
    try {
        const user = req.user
        if(!user.verified){
            return res.status(401).json({msg:"Please verify your account"})
        }
        const posts = await Jobs.find({company:user.userId})
        console.log(posts)
        return res.status(200).json(posts)
    } catch (error) {
        console.log(error)
    }
}

const updateJob = async (req,res) => {
    try {
        const jobId = req.params.jobId
        console.log(jobId)
        const job = req.body
        await Jobs.findByIdAndUpdate({_id:jobId},job);
        return res.status(201).json({msg:"job updated successfully"})
    } catch (error) {
        console.log(error)
    }
}

const deleteJob = async (req,res) => {
    try {
        const jobId = req.params.jobId
        await Jobs.findByIdAndDelete(jobId);
        return res.status(200).json({msg:"successfully deleted the job"})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {postJob,getAllPostedJobs,updateJob,deleteJob}