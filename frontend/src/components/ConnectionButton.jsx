import React, { useContext, useEffect, useState } from "react";

  import axios from "axios";
  import io from 'socket.io-client'
  import { userDataContex } from "../context/userContex";
  import { authDataContext } from "../context/AuthContext";
  const socket = io("http://localhost:3000")
  import { Navigate, useNavigate } from "react-router-dom";
 
 
function ConnectionButton({userId}) {
    
  let { serverUrl } = useContext(authDataContext);
  let {userData, setUserData} = useContext(userDataContex)
  let [status,setStatus] = useState("")
  let navigate = useNavigate()

  const handleSendConnection = async () =>{
    try {
        let result = await axios.post(serverUrl+`/api/connection/send/${userId}`,{},{withCredentials:true})
        console.log(result)
    } catch (error) {
         console.log("ERROR:", error.response?.data?.message);
    }
  }

    const handleRemoveConnection = async () =>{
    try {
        let result = await axios.delete(serverUrl+`/api/connection/remove/${userId}`,{withCredentials:true})
                                                
        console.log(result)
    } catch (error) {
        console.log(error)
    }
  }


   const handleGetStatus = async () =>{
    try {
        let result = await axios.get(serverUrl+`/api/connection/getstatus/${userId}`,{withCredentials:true})
        console.log(result)
        setStatus(result.data.status)
    } catch (error) {
        console.log(error)
    }
  }

useEffect(()=>{

    socket.emit("register",userData._id);
    handleGetStatus();
   
    socket.on("statusUpdate",({updatedUserId,newStatus})=> {
        if (updatedUserId==userId) {
           setStatus(newStatus)
        }
        })

    return () =>{
        socket.off("statusUpdate")
    }  
   },[userId])


const handleClick = async ()=>{
    if (status == 'disconnect') {
        await handleRemoveConnection()
    }else if(status == "received"){
        navigate("/network")
    }else {
       await handleSendConnection()
    }
  }
 console.log("Current Status:", status)
  return (
    <div>
      <button onClick={handleClick} className="h-10 min-w-[100px] border-2 border-[#46b6e6] text-[#46b6e6] shadow-md rounded-full my-[25px] flex items-center justify-center gap-[10px]" disabled={status=="pending"} >
       {status}
      </button>
    </div>
  );
}

export default ConnectionButton;
