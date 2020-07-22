import React,{useState,useContext} from 'react';
import {NavLink,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App'

const Login = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const PostData =() =>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#c62828 red darken-3"})
            return;
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data =>{
            console.log(data)
           if(data.err){
                M.toast({html:data.err,classes:"#c62828 red darken-3"})
            } 
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Sign in Successful",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
            <h2 className="headin">Postagram</h2>
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
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>PostData()}>
                Login
            </button>
            <h5 className="login-mess">
                <NavLink to='/signup'>Don't have an account ?</NavLink>
            </h5>
            <h6 className="login-mess">
                <NavLink to='/reset'>Forgot password ?</NavLink>
            </h6>
           </div>
        </div>
    )
}

export default Login;