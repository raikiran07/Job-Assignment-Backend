const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UsersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter name'],

    },
    email:{
        type:String,
        required:[true,'enter valid user email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:5

    },
    phoneNo:{
        type:String,
        required:[true,'Phone number is required']
    },
    location:{
        type:String,
        required:[true,'Please provide location']
    },
    description:{
        type:String,
        required:[true,'Plase provide description'],
        minlength:20
    },
    companyType:{
        type:String,
        required:[true,'Please provide company type']
    },
    size:{
        type:String,
        required:[true,'Please provide company size']
    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    phoneVerified:{
      type:Boolean,
      default:false
    }
})

UsersSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })
  
  UsersSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id, name: this.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    )
  }

  UsersSchema.methods.comparePassword = async function(rawpassword){
    const isCorrect = await bcrypt.compare(rawpassword,this.password)
    return isCorrect
    
    
  }
  
module.exports = mongoose.model('Users',UsersSchema)