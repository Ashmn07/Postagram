import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () =>{
    
    const history = useHistory()
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")

    useEffect(()=>{
        if(url){
            fetch("/api/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                   title,
                   body,
                   pic:url
                })
            }).then(res=>res.json())
            .then(data =>{
               if(data.err){
                    M.toast({html:data.err,classes:"#c62828 red darken-3"})
                } 
                else{
                    M.toast({html:"Created Post Successfully",classes:"#43a047 green darken-1"})
                    history.push('/')
                }
            })
        }
    },[url])
    

    const postDetails = () =>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","ashcloud");
        fetch("https://api.cloudinary.com/v1_1/ashcloud/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>console.log(err))
    }


    return(
       <div className="card input-filled"
       style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
       }} >
           <h2 className="headin">Create a New Post</h2>
           <input type='text' placeholder='title' value={title} onChange={(e)=>setTitle(e.target.value)}/>
           <input type="text" placeholder="body" value={body} onChange={(e)=>setBody(e.target.value)}/>
           <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>UPLOAD IMAGE</span>
                    <input type="file" /*value={image} */ onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div> 
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>postDetails()}>
                SUBMIT POST
            </button>   
       </div>
    )
}

export default CreatePost;