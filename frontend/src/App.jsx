import React,{ useState,useEffect } from 'react'
import './App.css'
import Login from './Login'
import Register from './Register'
import axios from './axios'
import { BrowserRouter as Routes ,Route } from 'react-router-dom'


function App() {
  


  return (
     <div>
      
     
      
 </div>
  )
}

export default App




//const [user , setUser] = useState('')
// const [message,setMessage] = useState(null)
// const getSession = async ()=>{
//   try{
//       const response  = await axios.get('/session', { withCredentials: true})
//       console.log("response =" , response.data);
      
//       return response.data
//   }catch(error){
//     console.error("Error in getSession :: App.jsx ", error)
//   }
// }

// useEffect(()=>{
// const fetchSession = async()=>{
//   try{
//     const sessionData = await getSession();
//     console.log(sessionData)
//     if(sessionData.user){
//       setUser(sessionData.user)
//     }else{
//        setMessage(sessionData.message)
//     }

//   }catch(error){
//     setMessage("Error Fetching session data")
//   }
// }

// fetchSession()
// },[])