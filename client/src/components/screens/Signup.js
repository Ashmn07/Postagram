import React,{useState,useEffect} from 'react';
import {NavLink,useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Signup = () => {
    const history = useHistory()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)

    useEffect(()=>{
        if(url)
            postData()
    },[url])
    
    const uploadPic = () =>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","ashcloud");
        console.log(data)
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

    const postData =() =>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#c62828 red darken-3"})
            return;
        }
        fetch("/api/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data =>{
           if(data.err){
                M.toast({html:data.err,classes:"#c62828 red darken-3"})
            } 
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
            }
        })
    }

    const FinalUpload =()=>{
        if(image)
            uploadPic()
        else
            postData()
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
            <h2 className="headin">Postagram</h2>
            <input 
            type="text"
            placeholder="name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <input 
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input 
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>UPLOAD PIC</span>
                    <input type="file" /*value={image} */ onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div> 
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>FinalUpload()}>
                Sign UP
            </button>
            <h5 className="login-mess">
                <NavLink to='/login'>Already have an account ?</NavLink>
            </h5>
           </div>
        </div>
    )
}

export default Signup;