const Users = require('../models/Users')
const StatusCodes = require('http-status-codes')
const Otp = require('../models/emailOtp')
const MobileOtp = require('../models/phoneOtp')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmails')
const sendMobileOtp = require('../utils/sendMobile')
const PhoneOtp = require('../models/phoneOtp')



const register = async (req,res) => {
    console.log("hello from register")
    const {email,phoneNo} = req.body
    console.log(email)
    try {

        // checking if user already present in the database
        const userPresent = await Users.findOne({email})
        if(userPresent){
            return res.status(StatusCodes.BAD_REQUEST).json({
                msg:"user already registered, please login"
            })
        }

        // creating a new user
        const user = await Users.create(req.body)

        if(!user){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                msg:"Internal Server Error"
            })
        }

        // creating an otp for email for verification
        const otpNumber = crypto.randomInt(100000,999999);
        const newOtp = await new Otp({
            userId:user._id,
            otp:otpNumber
        }).save();

      
        const messageBody = `Your verification otp - ${otpNumber}`
		await sendEmail(user.email, "Verify Email",messageBody );

        // creating otp for mobile number verification
        const mobileOtp = crypto.randomInt(100000,999999);
        const newMobileOtp = await new PhoneOtp({
            userId:user._id,
            otp:mobileOtp
        }).save()


        // sending otp for mobile number verification
        await sendMobileOtp(res,mobileOtp,phoneNo)

		res.status(201)
			.json({ msg: "otp is sent to your email and phone for verification"});

    } catch (error) {
        console.log(error)
        return res.status(400).json({error})
    }
}


const login = async (req,res) => {
    console.log("hello from login")
    try {
        const {email,password} = req.body
        const user = await Users.findOne({email})
        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"email is not registed"})
        }

        const comparePassword = await user.comparePassword(password)
        if(!comparePassword){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"password is incorrect"})
        }

    

        // checking if user email and phone is verified
        if(!user.emailVerified || !user.phoneVerified){
            return res.status(400).json({msg:"Please verify your email and phone number"})
        }

        const {_id:userId,name} = user
        const token = user.createJWT()

        res.cookie('token',token,{
            httpOnly:true,
            
            // when set to cloud backend server change it to true
            secure:true,
            sameSite:"None",
        }).status(200).json({userId,name,msg:'successfully login',token})
    } catch (error) {
        console.log(error)
    }
}

const logout = (req,res) => {
    try {
        const {token} = req.cookies
        // console.log("token:"+token)
       res.clearCookie("token")
       return res.status(200).json({msg:`succefully logout`})
    } catch (error) {
        // console.log(error)
        res.status(500).json({msg:'something went wrong'})
    }
}

const verifyEmail = async (req,res) => {
    console.log("hello from verify email")
    // console.log(req.params.token);
    const {otp,email} = req.body
    console.log(email)
    console.log(otp)
    try {
        const user = await Users.findOne({email})
        console.log(user)
        if(!user)return res.status(400).json({msg:"Invalid User"})

        const otpPresent = await Otp.findOne({
            otp,
            userId:user._id
        })

        if(!otpPresent){
            return res.status(400).json({msg:"Invalid otp"})
        }

         // update verify mobile to users
         await user.updateOne({emailVerified:true})

         // delete mobile otp
         await Otp.findByIdAndDelete(otpPresent._id)

        return res.status(200).json({msg:"email verified successfully",status:200})


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:"Internal Server Error"
        })
    }
    
}

const verifyMobileNumber = async (req,res) => {
    console.log("hello from verify email")
    // console.log(req.params.token);
    const {otp,email} = req.body
  
    try {
        const user = await Users.findOne({email})
        console.log(user)
        if(!user)return res.status(400).json({msg:"Invalid User"})

        const otpPresent = await MobileOtp.findOne({
            otp,
            userId:user._id
        })

        if(!otpPresent){
            return res.status(400).json({msg:"Invalid otp"})
        }

        // update verify mobile to users
        await user.updateOne({phoneVerified:true})

        // delete mobile otp
        await MobileOtp.findByIdAndDelete(otpPresent._id)

        return res.status(200).json({msg:"Phone number verified successfully",status:200})

    //     console.log(token)
        
    //     // await user.updateOne({_id:user._id,verified:true})
    //     await user.updateOne({verified:true})
    //     console.log("updated successfully")
    //     await Token.deleteOne({_id:token._id})
    //     console.log("token removed")
    //     return res.status(StatusCodes.OK).json({msg:"successfully verified email"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:"Internal Server Error"
        })
    }
    
}


module.exports = {login,register,logout,verifyEmail,verifyMobileNumber}