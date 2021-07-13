const express =require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post")
const requiredLogin = require('../middleware/requireLogin');

router.get('/allposts',requiredLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort("-createdAt")
    .then((post)=>{
        res.statusCode=200;
        res.json({post})
    })
    .catch(err => console.log(err))
})

router.get('/myfolposts',requiredLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then((post)=>{
        res.statusCode=200;
        res.json({post})
    })
    .catch(err => console.log(err))
})

router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,body,pic} = req.body;
    if(!title || !body || !pic){
        res.statusCode=422;
        return res.json({err:"Please fill all the fields"})
    }
  //  req.user.password = undefined;
   const post = new Post({
       title,
       body,
       photo:pic,
       postedBy:req.user
   })
   post.save()
   .then((result) =>{
       res.statusCode=200;
       res.json({post:result})
   })
   .catch(err => console.log(err))
})

router.get('/myposts',requiredLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name pic")
    .then((mypost)=>{
        res.statusCode=200;
        res.json({mypost})
    })
    .catch(err => console.log(err))
})

router.put('/comment',requiredLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .exec((err,result) =>{
        if(err){
            res.statusCode=422
            res.json({error:err})
        }
        else{
            res.statusCode=200
            res.json(result)
        }
    })
})

router.put('/like',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .exec((err,result) =>{
        if(err){
            res.statusCode=422
            res.json({error:err})
        }
        else{
            res.statusCode=200
            res.json(result)
        }
    })
})

router.put('/unlike',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .exec((err,result) =>{
        if(err){
            res.statusCode=422
            res.json({error:err})
        }
        else{
            res.statusCode=200
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requiredLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post) => {
        if(err|| !post){
            res.statusCode=422
            res.json({error:err})
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result => res.json(result))
            .catch(err => console.log(err))
        }
    })
})

router.delete('/deletepost/:postId/:commentId',requiredLogin,(req,res) => {
    Post.findOne({_id:req.body.postId})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .then(item =>{
        if(item!=null){
            item.comments.remove(req.body.commentId)
            item.save()
            .then((item) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(item);
          });
        } 
      },
      (err) => console.log(err))
    .catch((err) => console.log(err));
})

module.exports = router;

