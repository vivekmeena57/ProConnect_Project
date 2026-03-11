import React, { useContext, useState } from "react";

import ProConnectLogo from '../assets/ProConnectLogo.jpg'
import dp from "../assets/profilelogo.jpg";
import { IoMdSearch } from "react-icons/io";
import { IoHome, IoNavigate } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false);
  let [showPop, setShowPop] = useState(false);
  let { userData, setUserData,handleGetProfile } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [searchInput , setSearchInput] = useState("")
  let [searchedData,setSearchedData] = useState([])
  let navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      navigate("/login");
      setUserData(null);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async ()=>{

     if (!searchInput.trim()) {
    setSearchedData([]);
    return; 
  }
    
    try {
      let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials:true})
      setSearchedData(result.data)
    } catch (error) {
      setSearchedData([])
      console.log(error)
    }
  }

useEffect(()=>{
 handleSearch()
},[searchInput])

  return (
    <div className= "bg-white shadow-md lg:px-8 px-3 py-4 flex items-center md:justify-around sticky justify-between top-0 z-50">
      {/* leftSide */}
      <div className="flex items-end gap-3 ">
        <div
          onClick={() => {
            setActiveSearch((prev) => !prev);
            navigate("/");
          }}
        >
          <img src={ProConnectLogo} alt="" className="h-11" />
        </div>

        {!activeSearch && (
          <div
            className=" w-[23px] h-[23px] mb-3 text-3xl lg:hidden "
            onClick={() => {
              setActiveSearch(true);
            }}
          >
            <IoMdSearch />
          </div>
        )}

        <div>

    {searchedData.length>0 &&
      
        <div className=" absolute top-[90px] p-12 left-0 lg:left-32  w-full md:w-full  lg:w-[800px] h-[300px] overflow-auto bg-white flex flex-col  shadow-lg rounded-lg">
            {searchedData.map((src)=>(
              <div onClick={()=>handleGetProfile(src.userName)}
               className="flex gap-[20px] items-center mt-6 border-b-2 border-gray-200 p-2 hover:bg-gray-200 cursor-pointer rounded-lg">
             
            <div className="w-14 h-14 rounded-full overflow-hidden ">
              <img src={src.profileImage || dp} className="w-full h-full  object-cover " />
             </div>

             <div>
              <div  className="text-lg font-semibold ">{`${src.firstName} ${src.lastName}`}</div>
              <div className="text-gray-600"> {`${src.headline}`} </div>
             </div>
         
            </div>
          
            ))}
        </div>}


          <form
            action=""
            className={`bg-gray-200 mb-1 lg:h-9 h-8 rounded-full lg:px-6 px-3 text-sm lg:w-80  md:w-64  w-48  ${activeSearch ? "flex" : "hidden lg:flex"}  flex`}
          >
            <div className="mt-2 pr-3 text-xl ">
              <IoMdSearch />
            </div>
            <input
              type="text"
              placeholder="Search Something..."
              className="bg-slate-200 outline-none lg:py-2 lg:w-72 md:w-52 w-32 "
              value={searchInput}
              onChange={(e)=>setSearchInput(e.target.value)}
            />

          </form>
        </div>
      </div>

      {/* rigthSide */}
      <div className="flex items-end gap-5 relative">
        {/* pop */}
        {showPop && (
          <div className="w-[300px] min:h-[300px] bg-gray-100 right-0 shadow-lg absolute top-[75px]  rounded-lg flex flex-col items-center p-5 gap-4 border-2">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={userData.profileImage}
                alt=""
                className="w-full h-full object-cover "
              />
            </div>

            <div className="text-lg font-semibold ">
              {`${userData.firstName} ${userData.lastName}`}
            </div>

            <button
              onClick={()=>handleGetProfile(userData.userName)}
              className="h-10 w-full border-2 border-[#46b6e6] hover:bg-blue-100 text-[#46b6e6] shadow-md rounded-full "
            >
              View Profile
            </button>

            <div className="w-full h-[1px] bg-gray-400 "></div>

            <div
              onClick={() => navigate("/network")}
              className=" flex items-center w-full h-8 rounded-lg justify-start text-gray-600 gap-2 cursor-pointer hover:bg-gray-200 "
            >
              <div className="pl-6">
                <BsPeopleFill />
              </div>
              <div className="text-sm">My Network</div>
            </div>

            <button
              onClick={handleSignOut}
              className="h-10 w-52 border-2 border-[rgb(245,105,105)] text-[rgb(245,105,105)] hover:bg-red-100 shadow-md rounded-full "
            >
              Sign Out
            </button>
          </div>
        )}

        <div
          onClick={() => navigate("/")}
          className="md:flex flex-col items-center justify-center text-black hidden cursor-pointer opacity-75 hover:opacity-100"
        >
          <div className="pl-1.5">
            <IoHome />
          </div>
          <div className="text-sm">Home</div>
        </div>

        <div
          onClick={() => navigate("/network")}
          className="md:flex flex-col items-center justify-center text-black hidden cursor-pointer opacity-75 hover:opacity-100 "
        >
          <div >
            <BsPeopleFill />
          </div>
          <div className="text-sm">My Network</div>
        </div>
        <div onClick={()=>navigate("/notification")} className="pl-5 w-[23px] h-[23px] mb-3 text-3xl md:hidden  text-black  cursor-pointer opacity-75 hover:opacity-100 ">
          <IoNotifications />
        </div>
        <div onClick={()=>navigate("/notification")} className=" text-black cursor-pointer opacity-75 hover:opacity-100">
          <div className="pl-5  hidden md:flex opacity-75 hover:opacity-100 ">
            <IoNotifications />
          </div>
          <div className="text-sm hidden md:flex  ">Notification</div>
        </div>

        <div
          className="w-12 h-12 rounded-full overflow-hidden cursor-pointer "
          onClick={() => {
            setShowPop((prev) => !prev);
          }}
        >
          <img
            src={userData.profileImage || dp}
            alt=""
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
