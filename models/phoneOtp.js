const mongoose = require('mongoose')

const phoneOtpSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"users",
        unique:true

    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now, expires:3600
    }
})

module.exports = mongoose.model('phoneOtp',phoneOtpSchema)