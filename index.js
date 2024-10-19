require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

// Configure CORS middleware for production
const corsOptions = {
    origin: 'https://job-assignment-frontend.vercel.app', // Frontend URL that you want to allow
    credentials: true, // Allow cookies/credentials to be sent
  };

// for development
// const corsOptions = {
//     origin: 'http://localhost:5173', // Frontend URL that you want to allow
//     credentials: true, // Allow cookies/credentials to be sent
// }
app.use(cors(corsOptions))
app.use(cookieParser())
const connectDb = require('./config/connectDb')

// setting view engine
app.set('view engine','ejs')

// setting view engine
app.set('views',path.join(__dirname,'views'))

// serving static images
app.use(express.static('./public'))

// importing routers
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/job')

// importing custom middlewares
const authMiddleware = require('./middlewares/auth')

// Port
const PORT = process.env.PORT || 5001

// third party middlewares

app.use(express.urlencoded({extended:false}))
app.use(express.json())



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