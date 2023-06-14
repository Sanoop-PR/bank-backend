// define node app and mongodb database connectivity

// import mongoose  
const mongoose = require('mongoose')

// to get connection string from .env file : process.env

const connectionString = process.env.DATABASE

mongoose.connect(connectionString,{
    useUnifiedTopology:r=true,
    useNewUrlParser:true
}).then(()=>{
    console.log("Mongobd atlas connected successfully");
}).catch(()=>[
    console.log('MongoBD Connection error')
])