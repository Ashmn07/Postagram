import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile = () => {
    const {state,dispatch} = useContext(UserContext)
    const [userProfile,setProfile] = useState(null)
    const {userid} = useParams()
    const[showFollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result => {
            setProfile(result)
        })
    },[])

    const followUser = ()=>{
        fetch('/api/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/api/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }
    return (
        <>
        {userProfile?
         <div style={{maxWidth:"550px",margin:"0px auto"}}>
         <div style={{
             display:"flex",
             justifyContent:"space-around",
             margin:"18px 0px",
             borderBottom:"1px solid grey"
         }}>
             <div>
                 <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
                 src={userProfile.user.pic}
                 alt="profile"/>
             </div>
             <div>
                 <h4>{userProfile.user.name}</h4>
                 <h5>{userProfile.user.email}</h5>
                 <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6>{userProfile.posts.length} posts</h6>
                    <h6>{userProfile.user.followers.length} followers</h6>
                    <h6>{userProfile.user.following.length} following</h6>
                    {showFollow?
                     <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        onClick={()=>followUser()}>
                        Follow
                    </button>:
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        onClick={()=>unfollowUser()}>
                        UnFollow
                    </button>
                    }
                 </div>
             </div>
         </div>
         <div className="gallery">
             {
                 userProfile?userProfile.posts.map(item =>{
                     return(
                         <img key={item._id} className="item" src={item.photo} alt={item.title} />  
                     )
                 }):"Loading"
             }
         </div>
     </div>:"Loading.."
        }
        </>
    )
}

export default UserProfile;