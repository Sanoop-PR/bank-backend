// Router specific middleware

// import jsonwebtoken
const jwt = require('jsonwebtoken')

const logMiddleware = (req,res,next)=>{
    console.log("Router specific middleware")
    // get token
    const token = req.headers['access-token']
    try {
        // verify token
        // destructure from { loginacno: 1000, iat: 1686031762 } its define login function in usercontroller.js
        const {loginacno} = jwt.verify(token,"supersecret")
        console.log(loginacno)
        // pass loginAcno to req
        req.debitAcno = loginacno
        // to process user request
        next()
    } 
    catch{
        res.status(401).json("please login")
    }
}

module.exports = {
    logMiddleware
}