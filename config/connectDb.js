const mongoose = require('mongoose')


function connectDb(URL){

    mongoose.connect(URL,{
        useNewUrlParser: true, useUnifiedTopology: true
    })

    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log('database connected')
    })
}

module.exports = connectDb