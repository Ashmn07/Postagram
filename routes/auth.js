const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {JWT_SECRET,SENDGRID_API,EMAIL} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
       api_key:SENDGRID_API
    }
}))

router.post("/signup",(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!email || !name || !password){
        res.statusCode = 422;
        return res.json({err:"All fields have not been filled"})
    }
    bcrypt.hash(password,12)
    .then((hashedpassword)=>{
        User.findOne({email:email})
        .then((saveduser)=>{
            if(saveduser){
                res.statusCode = 422;
                return res.json({err:"User already exists"}) 
            }
            const user = new User({
                email,password:hashedpassword,name,pic
            })
            user.save()
            .then((user)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"noreplyfakestagram@gmail.com",
                    subject:"signup success",
                    html:"<h1>Welcome to Instagram</h1>"
                })
                res.json({message:"saved successfully"})
            })
            .catch((err)=>console.log(err))
        })
        .catch((err)=>console.log(err))
    })
    .catch((err)=>console.log(err))
})
   
router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email|| !password){
        res.statusCode = 422;
        return res.json({err:"Please enter email and password"})
    }
    User.findOne({email:email})
    .then((saveduser)=>{
        if(!saveduser){
            res.statusCode = 422;
            return res.json({err:"Invalid Email or Password"}) 
        }
        bcrypt.compare(password,saveduser.password)
        .then((match)=>{
            if(match){
                //res.json({message:"Logged in"})
                const token = jwt.sign({_id:saveduser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = saveduser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                res.statusCode = 422;
                return res.json({err:"Invalid Email or Password"})  
            }
        })
        .catch((err)=>console.log(err))
    })
    .catch((err)=>console.log(err))
})  

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
            console.log(err)
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user =>{
            if(!user){
                res.statusCode=422
                res.json({error:"User with given email does not exist"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save()
            .then(result =>{
                transporter.sendMail({
                    to:user.email,
                    from:"noreplyfakestagram@gmail.com",
                    subject:"Reset Password",
                    html :
                    `<p>You requested for a password reset</p>
                    <h5>CLick on this <a href="${EMAIL}/reset/${token}">Link</a></h5>`
                })
                res.json({message:"check your email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12)
        .then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save()
           .then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;