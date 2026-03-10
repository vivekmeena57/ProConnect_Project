import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import dp from "../assets/profilelogo.jpg";
import { userDataContex } from "../context/userContex";
import { IoCameraOutline } from "react-icons/io5";
import { HiPencil } from "react-icons/hi2";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import EditProfile from "../components/EditProfile";
import { FaPlus } from "react-icons/fa6";
import Post from "../components/Post.jsx";
import ConnectionButton from "../components/ConnectionButton.jsx";

function Profile() {
  let {
    userData,
    edit,
    setEdit,
    postData,
    setPostData,
    profileData,
    setProfileData,
  } = useContext(userDataContex);
  let { serverUrl } = useContext(authDataContext);
  let [profilePost, setProfilePost] = useState([]);

  useEffect(() => {
    setProfilePost(
      postData.filter((post) => post.author._id == profileData._id),
    );
  }, [profileData, postData]);

  return (
    <>
      <Nav />
      {edit && <EditProfile />}

      <div className="w-full min-h-screen bg-[#f0efe7] flex justify-center pt-6 px-5 ">
        <div className="w-full max-w-[900px] space-y-5 mb-14">
          {/* PROFILE HEADER */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* COVER IMAGE */}
            <div
              onClick={() => {
                if (profileData._id == userData._id) {
                  setEdit(true);
                }
              }}
              className="relative  h-[200px] bg-gray-300 cursor-pointer"
            >
              <img
                src={profileData.coverImage}
                className="w-full h-full object-cover"
              />
              <IoCameraOutline className="absolute right-4 bottom-4 text-white w-6 h-6" />
            </div>

            {/* PROFILE IMAGE */}
            <div className="relative px-6 pb-6">
              <div
                onClick={() => {
                  if (profileData._id == userData._id) {
                    setEdit(true);
                  }
                }}
                className="absolute -top-12 w-28 h-28 rounded-full overflow-hidden border-4 border-white cursor-pointer"
              >
                <img
                  src={profileData.profileImage || dp}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="z-50 w-[20px] h-[20px] bg-[#17c1ff] absolute top-8 left-28 rounded-full flex justify-center items-center cursor-pointer ">
                <FaPlus className="text-white" />
              </div>

              <div className="pt-16 flex flex-col sm:flex-row  justify-between items-start">
                <div>
                  <h2 className="text-xl md:text-xl lg:text-2xl font-semibold">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-400 pb-2">{profileData.gender}</p>

                  <p className="text-gray-600 text-lg">
                    {profileData.headline || "Add your professional headline"}
                  </p>

                  <p className="text-gray-500">
                    {profileData.location || "Add location"}
                  </p>

                  <p className="text-blue-400 font-medium mt-1">
                    {profileData.connection.length} Connections
                  </p>
                </div>

                {profileData._id == userData._id && (
                  <button
                    onClick={() => setEdit(true)}
                    className="border-2 border-blue-400 text-blue-400 px-4 sm:px-5 py-2 rounded-full hover:bg-blue-50  text-sm sm:text-base  w-full  sm:w-auto  flex items-center justify-center gap-2 "
                  >
                   
                    Edit Profile
                    <HiPencil />
                 
                  </button>
                )}
                {profileData._id != userData._id && (
                  <ConnectionButton userId={profileData._id} />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 ">
            <div className="flex justify-between">
               <h3 className="text-xl font-semibold mb-3">About</h3>
             {profileData._id === userData._id && (
                <button
                  onClick={() => setEdit(true)}
                  className="border-2 border-blue-400 text-blue-400 px-5 py-2 rounded-full flex items-center gap-2 hover:bg-blue-50 mb-5" >
                  Add About
                </button>
              )}
           
            </div>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {profileData.about}
            </p>
          </div>

          {/* allPosts */}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 pb-3 border-b-2 border-gray-400">{`Posts (${profilePost.length})`}</h3>
            
          </div>

          {profilePost.map((post, index) => (
            <div key={index}>
              <Post
                key={index}
                id={post._id}
                description={post.description}
                author={post.author}
                image={post.image}
                like={post.like}
                comment={post.comment}
                createdAt={post.createdAt}
              />
            </div>
          ))}

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-3">Skills</h3>
              {profileData._id == userData._id && (
                <button
                  onClick={() => setEdit(true)}
                  className="border-2 border-blue-400 text-blue-400 px-5 py-2 rounded-full flex items-center gap-2 hover:bg-blue-50 mb-5"
                >
                  Add Skills
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {profileData.skills?.length > 0 ? (
                profileData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  Add skills to improve your profile
                </p>
              )}
            </div>
          </div>

          {/* Education SECTION */}

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-3">Education</h3>
              {profileData._id === userData._id && (
                <button
                  onClick={() => setEdit(true)}
                  className="border-2 border-blue-400 text-blue-400 px-5 py-2 rounded-full flex items-center gap-2 hover:bg-blue-50 mb-5"
                >
                  Add Education
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {profileData.education?.length > 0 ? (
                profileData.education.map((edu, index) => (
                  <div key={index} className="bg-blue-400 rounded w-full pl-6 min-h-[100px]">
                    <h3>Collage : {edu.collage}</h3>
                    <h2>Degree : {edu.degree}</h2>
                    <h2>fieldOfStudy : {edu.fieldOfStudy}</h2>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  Add education to improve your profile
                </p>
              )}
            </div>
          </div>

          {/* experience SECTION */}

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-3">Experience</h3>
              {profileData._id == userData._id && (
                <button
                  onClick={() => setEdit(true)}
                  className="border-2 border-blue-400 text-blue-400 px-5 py-2 rounded-full flex items-center gap-2 hover:bg-blue-50 mb-5"
                >
                  Add Experience
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {profileData.experience?.length > 0 ? (
                profileData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-blue-400 rounded w-full pl-6 min-h-[100px]"
                  >
                    <h3>title : {exp.title}</h3>
                    <h2>company : {exp.company}</h2>
                    <h2>description : {exp.description}</h2>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  Add experience to improve your profile
                </p>
              )}
            </div>
          </div>

          {/* CONNECTION SECTION */}

          <div className="bg-white rounded-lg shadow-md p-6 ">
            <h3 className="text-xl font-semibold mb-3">Connections</h3>

            <p className="text-gray-600 ">
              You have {profileData.connection.length} connections
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
