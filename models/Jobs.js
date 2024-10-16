const mongoose = require('mongoose')


const JobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title is required'],
    },
    company:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:[true,'Please provide company name']
    },
 
    experience:{
        type:String,
        required:[true,'Please provide required experience']
    },
   description:{
        type:String,
        required:[true,'Please provide description']
   },
   
    endDate:{
        type:Date,
        required:[true,'Please provide application dead line']
    },
    candidates:{
        type:[String]
    }
},{timestamps:true})

module.exports = mongoose.model('Jobs',JobSchema);