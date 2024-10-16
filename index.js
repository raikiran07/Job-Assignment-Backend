require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
app.use(cors())
const connectDb = require('./config/connectDb')

// importing routers
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/job')

// importing custom middlewares
const authMiddleware = require('./middlewares/auth')

// Port
const PORT = process.env.PORT || 5000

// third party middlewares

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())


// auth router
app.use('/api/v1/auth/user',authRouter)
app.use('/api/v1/job',authMiddleware,jobRouter);



const start = async ()=>{
    try {
        connectDb(process.env.MONGO_URI)
        // listening app
        app.listen(PORT,()=>{
            console.log(`server is running in port ${PORT}`)
        })

    } catch (error) {
        console.log(error)
    }
}

app.get('/',(req,res)=>{
    res.send("hello from api")
})


// starting the server
start()