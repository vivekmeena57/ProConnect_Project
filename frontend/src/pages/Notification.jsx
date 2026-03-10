import React, { useContext, useEffect, useState } from "react"
import { RxCross2 } from "react-icons/rx";
import Nav from "../components/Nav";
import dp from "../assets/profilelogo.jpg";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";

function Notification() {
  let { serverUrl } = useContext(authDataContext);
  let [notificationData, setNotificationData] = useState([]);

  const handleGetNotification = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/notification/get", {
        withCredentials: true,
      });
      setNotificationData(result.data);
    } catch (error) {
        console.log(error)
    }
  };

 const handleDeleteNotification = async (id) => {
    try {
      let result = await axios.delete(serverUrl + `/api/notification/deleteone/${id}`, {
        withCredentials: true,
      });
      await handleGetNotification()
    } catch (error) {
        console.log(error)
    }
  };

  const handleClearAllNotification = async () => {
    try {
      let result = await axios.delete(serverUrl + `/api/notification`, {
        withCredentials: true,
      });
      await handleGetNotification()
    } catch (error) {
        console.log(error)
    }
  };

  useEffect(()=>{
    handleGetNotification()
  },[])


function handleMessage(type) {
    if (type == "like" ) {
        return  "Like your post"
    }else if(type=="comment"){
        return " Comment on your post"
    }else{
        return "Accept connection request"
    }
}

  return (
   
      
      <div className=" min-h-screen bg-[#f0efe7] flex flex-col ">
        <Nav />
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto flex justify-between items-center bg-white rounded-lg shadow-lg p-4 mt-6">
           <div className="text-xl">notifications : <span>({notificationData.length})</span></div>
         <div>{notificationData.length >0 && <button className="bg-black text-white hover:bg-red-400 pl-5 pr-5 h-8 rounded-full" onClick={handleClearAllNotification}> Clear all</button>} </div>
        
        </div>
      
      
     {notificationData.length > 0 && (
            <div className="p-2 flex flex-col items-center">
              {notificationData.map((noti, index) => (
            
                <div key={index} className="w-full md:w-2/3 lg:w-1/2 bg-white rounded-lg mt-3 shadow-lg p-3">
                  <div className="flex  items-center  ">

                    <div className="w-12 h-12 md:w-14 md:h-14rounded-full overflow-hidden m-3 mr-5">
                      <img
                        src={noti.relatedUser.profileImage || dp}
                        alt=""
                        className="w-full h-full"
                      />
                    </div>
                  
                    <div className="flex justify-between items-center w-full ">
                    <div>{noti.relatedUser.firstName} {noti.relatedUser.lastName} {handleMessage(noti.type)}</div>   
                     <div onClick={()=>handleDeleteNotification(noti._id)} ><RxCross2 className="size-6"/></div>
                    </div>
                  
                  </div>  
                  <div className="w-20 h-14 ml-16 md:ml-20"><img src={noti.relatedPost.image} alt="" /></div>
                </div>
              ))}
            </div>
          )}





      </div>
  
  );
}

export default Notification;
