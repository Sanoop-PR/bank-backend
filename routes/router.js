// import express
const express = require('express')

// create routes , using express.router() class,object
const router = new express.Router()

// import controller 
const userController = require('../controllers/usercontroller')

// import router specific middleware
const middleware = require('../middleware/routerSpecific')

// define routes to resolve http request


// register rqst
router.post('/employee/register',userController.register)

// login request
router.post('/employee/login',userController.login)

// balance get request
router.get('/user/balance/:acno',middleware.logMiddleware,userController.balance)

// fund transfer
router.post('/user/transfer',middleware.logMiddleware,userController.transfer)

// transaction
router.get('/user/transaction',middleware.logMiddleware,userController.transactions)

// delete acno
router.delete('/user/delete',middleware.logMiddleware,userController.deleteMyAcno)

// export router
module.exports = router