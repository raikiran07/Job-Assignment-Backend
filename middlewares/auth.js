const jwt = require('jsonwebtoken')
const User = require('../models/Users')

const authMiddleware = async (req,res,next) => {
  
    console.log("token from middleware")
    const {token} = req.cookies
    // console.log("token:"+token)
    console.log(token)
   
    try {
        // console.log(process.env.JWT_SECRET)
        const payload = jwt.verify(token,process.env.JWT_SECRET)

        const userDB = await User.findById(payload.userId)
        
        req.user = {userId:payload.userId,name:payload.name,emailVerified:userDB.emailVerified,phoneVerified:userDB.phoneVerified,email:userDB.email}
        // console.log(req.user)
       
        next()
        
    } catch (error) {
        console.log(error)
        res.status(401).json({msg:`Not authorized`})
    }
    

    
}

module.exports = authMiddleware