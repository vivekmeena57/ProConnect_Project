import React, { useContext, useEffect, useRef } from "react";
import Nav from "../components/Nav.jsx";
import dp from "../assets/profilelogo.jpg";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { IoCameraOutline } from "react-icons/io5";
import { userDataContext } from "../context/userContext.jsx";
import { HiPencil } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { LuImagePlus } from "react-icons/lu";
import EditProfile from "../components/EditProfile.jsx";
import { useState } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import Post from "../components/Post.jsx";

function Home() {
  let { userData, setUserData, edit, setEdit,postData,getPost,setPostData,handleGetProfile } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [frontendImage,setFrontendImage] = useState("")
  let [backendImage,setBackendImage] = useState("")
  let [description,setDescription] = useState("")
  let[uploadPost,setUploadPost] = useState(false)
  let[posting,setPosting] = useState(false)
  let [suggestedUser,setSuggestedUser] = useState([])
  
 

  function handleImage(e){
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  
  async function handleUploadPost(){
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description" , description) 
      if (backendImage) {
        formdata.append("image",backendImage) 
      }
      let result = await axios.post(serverUrl +"/api/post/create",formdata, { withCredentials: true })
      console.log(result);
      getPost()
      setPosting(false)
      setUploadPost(false)
      setDescription("")
      setFrontendImage("")
    } catch (error) {
      setPosting(false)
      console.log(error);   
    }
  }
  let image = useRef()


  const handleSuggestedUser = async ()=>{
    try {
        let result = await axios.get(`${serverUrl}/api/user/suggestedUsers`,{withCredentials:true})
        setSuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(()=>{
 handleSuggestedUser()
  },[])

  return (
    <>
      {edit && <EditProfile />}
      <Nav />
      <div className="w-full min-h-screen items-center lg:items-start bg-[#f0efe7] justify-center flex flex-col lg:flex-row pt-6 gap-5 px-3 sm:px-5 relative pb-12">
        {/* 1st */}
        <div className=" w-full lg:w-[25%] bg-white shadow-lg rounded-lg p-3 relative">
          <div
            onClick={() => setEdit(true)}
            className="bg-slate-400 w-[100%] h-[100px] rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
          >
            <img src={userData.coverImage} className="w-full " />
            <IoCameraOutline className="relative right-[15px] top-[-30px] w-[25px] h-[25px] text-white cursor-pointer  " />
          </div>

          <div
            onClick={() => setEdit(true)}
            className="w-16 h-16 rounded-full overflow-hidden absolute top-[75px] left-5 cursor-pointer"
          >
            <img src={userData.profileImage || dp} alt="" className=" h-full" />
          </div>

          <div className="z-45 w-[20px] h-[20px] bg-[#17c1ff] absolute top-[115px] left-[70px] rounded-full flex justify-center items-center cursor-pointer ">
            <FaPlus className="text-white" />
          </div>

          <div className="mt-[35px] pl-[15px]">
            <div className=" text-lg font-semibold ">{`${userData.firstName} ${userData.lastName}`}</div>
            <div className="text-[19px] text-gray-600">
              {`${userData.headline || ""}`}{" "}
            </div>
            <div className="text-[16px] text-gray-600">
              {`${userData.location}`}{" "}
            </div>

            <button
              onClick={() => setEdit(true)}
              className="h-10 w-full border-2 border-[#46b6e6] text-[#46b6e6] shadow-md rounded-full my-[25px] flex items-center justify-center gap-[10px] hover:bg-blue-100 "
            >
              Edit Profile <HiPencil />
            </button>
          </div>
        </div>

        {/* CREATE POST */}
        {uploadPost &&
          <div className="fixed w-full h-full bg-black opacity-70  z-[100] top-0 left-0 "></div>
        }
        {uploadPost && 
        <div className="w-[90%] max-w-[500px] h-[600px] bg-white z-[200] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed rounded-lg shadow-lg p-[20px] ">

        <div className="absolute right-[15px] top-[10px] cursor-pointer " >
           <RxCross2 onClick={ ()=>{setUploadPost(false)}} className=" h-[25px] w-[25px] text-gray-800 font-bold hover:scale-110 shadow-lg" />
         </div>
      
      <div className="flex justify-start items-center gap-3 ">
        <div className="w-16 h-16 rounded-full overflow-hidden items-center justify-center " >
          <img src={userData.profileImage || dp} alt="" className=" h-full  " />
        </div>
         <div>
           <div className=" text-lg font-semibold ">{`${userData.firstName} ${userData.lastName}`}</div>
         </div>
      </div> 
       <textarea onChange={(e)=>setDescription(e.target.value)} value={description} 
       placeholder="What do you want to talk about..?"  className={` mt-8 bg-gray-200 w-full ${frontendImage? "h-[150px]":"h-[300px]"} outline-none border-none p-[10px] resize-none  rounded-lg` }>
       </textarea>

     {frontendImage &&
      <div>
        <img src={frontendImage || ''} alt="" className=" mt-10 h-[100px] w-[100px] rounded-lg "/>
       </div>
     }
       

       <div className="w-full h-[200px] flex flex-col mt-10 ">
        <div className="  p-[20px] flex items-center justify-start  ">
          <LuImagePlus onClick={()=>image.current.click()}
          className="  hover:scale-110 w-[24px] h-[24px]  text-gray-600 cursor-pointer "/>
        </div>
         <input type="file" ref={image} hidden onChange={handleImage}/>

        <hr />
        <div  className="flex items-center justify-end">
          <button onClick={handleUploadPost}
          disabled={posting || !description.trim() }
          className=" w-24 h-12  rounded-full bg-blue-500  text-white hover:bg-blue-700 mt-4 active:scale-95 ">
             {posting?"Post..." : "Post"}
          </button>
 
        </div>
       </div>      
        </div>
        }

        {/* 2nd */}
        <div className=" w-full lg:w-[50%] min-h-[200px] bg-[#f0efe7] flex flex-col gap-5 " >
          <div className="w-full bg-white shadow-lg rounded-lg flex items-center gap-3 p-4">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center cursor-pointer mr-4 ">
              <img
                src={userData.profileImage || dp}
                alt=""
                className="h-full w-full"
              />
            </div>

            <div className="w-2/3 md:w-[80%] lg:w-[85%]">
              <button onClick={ ()=>{setUploadPost(true)}}
              className="w-full h-10 sm:h-11 md:h-12 border-2 border-gray-400 rounded-full flex items-center px-4 hover:bg-gray-200 text-sm sm:text-base">
                Start a post
              </button>
            </div>
          </div>


          {/* AllPosts */}
          {postData.map((post,index)=>(<Post key={index} id={post._id} description={post.description} 
          author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} 
          />))}
            
        </div>

        {/* 3rd */}
        <div className=" w-full lg:w-[25%] min-h-[200px] bg-white  shadow-lg hover:shadow-xl hidden lg:flex flex-col p-5 rounded-lg">
        <h1 className="text-gray-700 text-xl font-semibold mb-4">Suggested Users:</h1><hr />
        {suggestedUser.length > 0 && <div className="flex flex-col gap-5">
       
       {suggestedUser.map((sug)=>(
        
        <div onClick={()=>handleGetProfile(sug.userName)} className="flex mt-3  hover:bg-gray-100 rounded-lg  cursor-pointer">
         <div className="w-12 h-12 rounded-full  overflow-hidden ml-3 mr-2 ">
           <img src={sug.profileImage || dp} className="w-full h-full object-cover" />
         </div>

         <div>
          <div  className=" font-semibold ">{`${sug.firstName} ${sug.lastName}`}</div>
          <div className="text-gray-600 text-md"> {`${sug.headline}`} </div>
        </div>
          

        </div>
       ))}

       </div>

       }
 
 
        {suggestedUser.length == 0 && <div> No Suggetions</div> }

        </div>
      </div>
    </>
  );
}

export default Home;
