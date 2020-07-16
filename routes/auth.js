const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');

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

module.exports = router;