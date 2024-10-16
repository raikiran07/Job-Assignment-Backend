const router = require('express').Router()
const authMiddleware = require('../middlewares/auth')

const {register,login,logout,verifyEmail, verifyMobileNumber, getProfile} = require('../controllers/auth')


router.post('/register',register)
router.post('/login',login)
router.get('/profile',authMiddleware,getProfile)
router.post('/logout',authMiddleware,logout)
router.post('/verifyemail',verifyEmail)
router.post('/verifymobile',verifyMobileNumber)



module.exports = router