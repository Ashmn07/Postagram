import React,{useEffect,createContext,useReducer,useContext,Suspense,lazy} from 'react';
import Navbar from './components/Navbar';
import './App.css';
import {reducer,initialState} from './reducers/userReducer';
import {BrowserRouter,Route,Switch,Redirect,useHistory} from 'react-router-dom';
const Home = lazy(()=>import('./components/screens/Home'))
const Signup = lazy(()=>import('./components/screens/Signup'))
const Login = lazy(()=>import('./components/screens/Login'))
const Profile = lazy(()=>import('./components/screens/Profile'))
const CreatePost = lazy(()=>import('./components/screens/CreatePost'))
const UserProfile = lazy(()=>import('./components/screens/UserProfile'))
const ShowFollowingPost = lazy(()=>import('./components/screens/ShowFollowingPost'))
const Reset = lazy(()=>import('./components/screens/Reset'))
const NewPassword = lazy(()=>import('./components/screens/NewPassword'))
//  import Home from './components/screens/Home'
// import Signup from './components/screens/Signup'
// import Login from './components/screens/Login'
// import Profile from './components/screens/Profile'
// import CreatePost from './components/screens/CreatePost'
// import UserProfile from './components/screens/UserProfile';
// import ShowFollowingPost from './components/screens/ShowFollowingPost';
// import Reset from './components/screens/Reset';
// import NewPassword from './components/screens/NewPassword'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/login')
    }
  },[])
  return(
    <div className="backg">
      <Suspense
      fallback={
        <div className="loading"><h1>Loading...</h1></div>
      }>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/profile" component={Profile}/>
        <Route exact path="/create" component={CreatePost}/>
        <Route exact path="/profile/:userid" component={UserProfile}/>
        <Route exact path="/myfolpost" component={ShowFollowingPost}/>
        <Route exact path="/reset" component={Reset}/>
        <Route exact path="/reset/:token" component={NewPassword}/>
        <Redirect to="/"/>
      </Switch>
      </Suspense>
     </div> 
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar/>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
