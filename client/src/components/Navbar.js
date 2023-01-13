import React,{useContext,useRef,useEffect,useState} from 'react';
import {NavLink,useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import M from 'materialize-css'

const Navbars = () => {

    const searchModal = useRef(null)
    const {state,dispatch} = useContext(UserContext)
    const [search,setSearch] = useState("")
    const[userDetails,setUserDetails]=useState([])
    const history = useHistory()

    useEffect(()=>{
      M.Modal.init(searchModal.current)
  },[])

    const renderList = () => {
          if(state){
            return [
            <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" 
            style={{color:"black"}}>search</i></li>,
              <li className="n-link" key="2"><NavLink to="/profile">Profile</NavLink></li>,
              <li className="n-link" key="3"><NavLink to="/create">Create Post</NavLink></li>,
              <li className="n-link" key="4"><NavLink to="/myfolpost">My Following Posts</NavLink></li>,
              <li key="5">
                  <button className="btn btn-mod #c62828 red darken-3"
                      onClick={()=>{
                          localStorage.clear()
                          dispatch({type:"CLEAR"})
                          history.push('/login')
                      }}>
                          Logout
                  </button>
              </li>
            ]
        }
        else{
          return [
            <li className="n-link" key="6"><NavLink to="/login">Login</NavLink></li>,
            <li className="n-link"key="7"><NavLink to="/signup">Signup</NavLink></li>
          ] 
        }
    }

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/api/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
     }

   return(
    <nav>
      <div className="nav-wrapper white">
        <img style={{margin:"5px"}} src='https://img.icons8.com/fluent/48/000000/instagram-new.png' alt='insta-icon'/>
        <NavLink to={state?'/':'/login'} className="brand-logo left">Postagram</NavLink>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>   
      </div>
      <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
        <div className="modal-content">
        <input
          type="text"
          placeholder="search users"
          value={search}
          onChange={(e)=>fetchUsers(e.target.value)}
          />
            <ul className="collection">
              {userDetails.map(item=>{
                return <NavLink to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                  M.Modal.getInstance(searchModal.current).close()
                  setSearch('')
                }}><li className="collection-item">{item.email}</li></NavLink> 
              })}
              
            </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
        </div>
            </div>
    </nav>  
   ) 
}

export default Navbars;