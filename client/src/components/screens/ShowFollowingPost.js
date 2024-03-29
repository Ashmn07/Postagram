import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../App'
import {NavLink} from 'react-router-dom'

const Home = () => {
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/api/myfolposts',{
            method:"get",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result => {
            console.log(result)
            setData(result.post)
        })
    },[])
    
    const likePost = (id) => {
        fetch('/api/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res => res.json())
        .then(result => {
           const newData = data.map(item => {
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
            //console.log(result)
        })
        .catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        fetch('/api/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id,
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    }

    const makeComment = (text,postId) => {
        fetch('/api/comment',{
            method:"put",
            headers:{
                   "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    }

    const deletePost = (postId) => {
        fetch(`/api/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }       
        })
        .then(res => res.json())
        .then(result =>{
            const newData = data.filter(item => {
               return item._id != result._id
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    }

    const deleteComment = (postId,commentId) => {
        fetch(`/api/deletepost/${postId}/${commentId}`,{
            method:"delete",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                commentId
            })       
        })
        .then(res => res.json())
        .then(result => {
            window.location.reload()
            console.log(result)
        })
        .catch(err => console.log(err))
    } 
    

    return (
        <div className="home">
            {
                data.map(item =>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <div className="row">
                                <div >
                                <img style={{width:"50px",height:"50px",borderRadius:"25px",float:"left"}}
                                src={item.postedBy.pic}
                                />   
                                </div>
                                <div style={{paddingLeft:"20px"}}>
                                    <h4>
                                    <NavLink to={`/profile/${item.postedBy._id}`}>
                                    {item.postedBy.name}</NavLink> 
                                    </h4>
                                </div>
                            </div>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {item.likes.includes(state._id)?
                                <i className="material-icons" onClick={()=>unlikePost(item._id)}>thumb_down</i>:
                                <i className="material-icons" onClick={()=>likePost(item._id)}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return(
                                            <h6 key={record._id}><span style={{fontWeight:"500"}}>
                                                 {record.postedBy._id == state._id && 
                                                <i className="material-icons" style={{float:"right"}}
                                                onClick={()=>deleteComment(item._id,record._id)}
                                                >delete</i>}
                                           <span className="comhead">{record.postedBy.name} :</span> </span>{record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault();
                                    if(e.target[0])
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="add a comment"/>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home;