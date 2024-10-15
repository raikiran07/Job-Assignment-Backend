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
    salary:{
        type:String,
        required:[true,'Please provided salary in LPA']
    },
    experience:{
        type:String,
        required:[true,'Please provide required experience']
    },
    location:{
        type:String,
        required:[true,'Please provide job location']
    },
    vacancy:{
        type:Number,
        required:[true,'Please provide number of vacancy']
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