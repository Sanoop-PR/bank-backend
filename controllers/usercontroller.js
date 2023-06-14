// import model in userSchema.js file
const users = require('../models/userSchema')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

// define and export logic to resolve different http client request 

// register
exports.register = async (req,res)=>{

    // register logic 
    console.log(req.body)

    const { username,acno,password } = req.body

    if(!username || !acno || !password){
        res.status(403).json("All inputs are require")
    }
    try {
        const preuser = await users.findOne({acno})     

        if (preuser) {
            res.status(406).json("user Already exist!!!")
        } else {
            // add user to bd
            const newuser = new users({
                username,
                password,
                acno,
                balance:5000,
                transactions:[]
            })
            await newuser.save()
            res.status(200).json(newuser)
        }
        
    } catch (error) {
        res.status(401).json(error)
    }

}

// login
exports.login = async (req, res)=>{
    // get req body
    const {acno,password} = req.body

    try{
        // check acno and password is in db
        const preuser = await users.findOne({acno,password})
        // check preuser or not 
        if (preuser) {
            // generate token using jwt
            const token= jwt.sign({loginacno:acno},"supersecret")
            
            res.status(200).json({preuser,token})
        } else {
            res.status(404).json('Invalid account number or password')
        }
    }
    catch(error){
        res.status(401).json(error)
    }
}

// balance check
exports.balance = async (req , res)=>{
    // get acno from path parameter
    let acno = req.params.acno

    // get data of given acno
    try{
        const preuser = await users.findOne({acno})
        if (preuser) {
            res.status(200).json(preuser.balance)
        } else {
            res.status(404).json("Invalid Account Number!!!")
        }
    }
    catch(error){
        res.status(401).json(error)
    }
}

// fund transfer
exports.transfer = async (req,res)=>{
    console.log("inside transfer logic")
    // login
    // 1. get body from creditAcno,creditAmt,pswd
        // destructure
    const{creditAcno,creditAmt,pswd} = req.body
    const crdAmount = Number(creditAmt)
    const{debitAcno} = req
    // 2. check debit acno pswd is available in mongoBD
    const debitUser = await users.findOne({acno:debitAcno,password:pswd})
    console.log(debitUser)
    try {
        // 2. check debit acno and pswd is available in monbodb
        const debitUserDetails = await users.findOne({acno:debitAcno,password:pswd})
        console.log(debitUserDetails)

        // 3. check credit acno details from mongobd
        const creditUserDetails = await users.findOne({acno:creditAcno})
        console.log(creditUserDetails)

        if (debitAcno!=creditAcno) {
            if (debitUserDetails && creditUserDetails) {
                // check sufficient balance available for debitUserDetails
                if (debitUserDetails.balance>=crdAmount) {
                    // perform transfer
    
                    // -----DEBIT----
                    // debit creditAmount form debitUserDetails
                    debitUserDetails.balance-=crdAmount
                    // add debit transaction to debitUserDetails
                    debitUserDetails.transactions.push({
                        transactions_type:"DEBIT",amount:crdAmount,fromAcno:debitAcno,toAcno:creditAcno
                    })
                    // save debitUserDetails in mongodb
                    await debitUserDetails.save()
    
                    // ----CREDIT-----
                    // credit crdAmount to creditUserDetails
                    creditUserDetails.balance+=crdAmount
                    // add credit transaction to creditUserDetails
                    creditUserDetails.transactions.push({
                        transactions_type:"CREDIT",amount:crdAmount,fromAcno:debitAcno,toAcno:creditAcno
                    })
                    // save creditUserDetails in mongodb
                    await creditUserDetails.save()
                    res.status(200).json("Fund Transfer successfully completed")
    
                } else {
                    // Insufficient balance
                    res.status(406).json("Insufficient balance")
                }
            } else {
                res.status(406).json("Invalid credit / debit details")
            }
        } else {
            res.status(406).json("operation denied!!! self transfer not allowed")
        }

        
    } catch (error) {
        res.status(401).json(error)
    }
}

// transactions
exports.transactions = async (req,res)=>{
    // 1.get acno from req.debitAcno
    let acno = req.debitAcno
    try {
        // 2.check acno in mongodb
        const preuser = await users.findOne({acno}) 
        res.status(200).json(preuser.transactions)
    } catch (error) {
        res.status(401).json(error)
    }

}

// delete acno
exports.deleteMyAcno = async (req,res)=>{
    // 1. get acno form req
    let acno = req.debitAcno
    // remove acno from db
    try {
        await users.deleteOne({acno})
        res.status(200).json("Remove Successfully")
    } catch (error) {
        res.status(401).json(error)
    }
}