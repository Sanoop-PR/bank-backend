// import dotenv
require('dotenv').config()     // Loads .env file contents into process.env.

// import express 
const express = require('express')

// import cors
const cors = require('cors')


// import bd
require('./db/connection')
// import router
const router = require('./routes/router')

// import MIddleware
const middleware = require('./middleware/appMiddleware')

// create express server
const server = express()

// set up port number for server
// static and dynamic
const PORT  = 3000 || process.env.PORT

//  use cors , json parser in server app
server.use(cors())
server.use(express.json())
// use middleware in server
server.use(middleware.appMiddleware)
// use router in server
server.use(router)

// to resolve http request using express server 
server.get('/',(req,res)=>{
    res.send("bank server started!!!")
})


// run the server app in specified ports
server.listen(PORT,()=>{
    console.log(`bank server started at port number ${PORT}`)
})