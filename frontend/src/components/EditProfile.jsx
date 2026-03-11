import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext.jsx";
import { useContext } from "react";
import dp from "../assets/profilelogo.jpg";
import { FaPlus } from "react-icons/fa6";
import { IoCameraOutline } from "react-icons/io5";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";

function EditProfile() {
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData, edit, setEdit, getPost } =
    useContext(userDataContext);
  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [userName, setUserName] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [about, setAbout] = useState(userData.about || "");
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkills, setNewSkills] = useState("");
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNewEducation] = useState({
    collage: "",
    degree: "",
    fieldOfStudy: "",
  });
  let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  // image

  let [frontendProfileImage, setFrontendProfileImage] = useState(
    userData.profileImage || dp,
  );
  let [backendProfileImage, setBackendProfileImage] = useState(null);

  let [frontendCoverImage, setFrontendCoverImage] = useState(
    userData.coverImage || null,
  );
  let [backendCoverImage, setBackendCoverImage] = useState(null);

  let [saving, setSaving] = useState(false);

  const profileImage = useRef();
  const coverImage = useRef();

  function addSkill() {
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  function addEducation() {
    if (
      newEducation.collage &&
      newEducation.degree &&
      newEducation.fieldOfStudy
    ) {
      setEducation([...education, newEducation]);
    }
    setNewEducation({ collage: "", degree: "", fieldOfStudy: "" });
  }

  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu));
    }
  }

  function addExperience() {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.description
    ) {
      setExperience([...experience, newExperience]);
    }
    setNewExperience({ title: "", company: "", description: "" });
  }

  function removeExperience(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp));
    }
  }

  function handleProfileImage(e) {
    let file = e.target.files[0];
    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  }

  function handleCoverImage(e) {
    let file = e.target.files[0];
    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("gender", gender);
      formdata.append("about", about);
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));
      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage);
      }
      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage);
      }

      let result = await axios.put(
        serverUrl + "/api/user/saveprofile",
        formdata,
        { withCredentials: true },
      );
      setUserData(result.data);
      setSaving(false);
      setEdit(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center ">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileImage}
      />

      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverImage}
      />

      <div className=" bg-black opacity-[0.5] w-full h-full absolute "></div>

      <div className="bg-white h-[650px] w-[90%] border-2 border-gray-500 max-w-[580px] absolute z-[200] shadow-lg rounded-md p-[20px]  overflow-y-auto hide-scrollbar ">
        <div
          onClick={() => setEdit(false)}
          className="absolute right-[15px] top-[10px] cursor-pointer "
        >
          <RxCross2 className=" h-[25px] w-[25px] text-gray-800 font-bold  hover:scale-110 shadow-lg" />
        </div>

        <div
          className="w-full h-[130px] bg-gray-400 rounded-lg mt-4 cursor-pointer relative"
          onClick={() => coverImage.current.click()}
        >
          <img
            src={frontendCoverImage}
            className="w-full h-full object-cover rounded-lg"
          />
          <IoCameraOutline className="absolute  right-2  bottom-24 w-[25px] h-[25px] bg-white-400 text-white cursor-pointer hover:scale-105" />
        </div>

        <div
          className="w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[130px] left-[40px] cursor-pointer"
          onClick={() => profileImage.current.click()}
        >
          <img src={frontendProfileImage} className="w-full h-full " />
        </div>

        <div className="z-50 w-[20px] h-[20px] bg-[#17c1ff] absolute top-[185px] left-[100px] rounded-full flex justify-center items-center cursor-pointer ">
          <FaPlus className="text-white" />
        </div>

        <div className="space-y-4 mt-[60px]">
          {/* First & Last Name */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First name"
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Username */}

          <input
            type="text"
            placeholder="Username (e.g. vivek-meena)"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          {/* Headline */}

          <input
            type="text"
            placeholder="Headline (e.g. Frontend Developer | React | Node)"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />

          {/* Location */}

          <input
            type="text"
            placeholder="Location (e.g. Jaipur, India)"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Gender */}

          <select
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          {/* about */}

          <div>
            <h1 className="text-[19px] font-semibold pl-2 mb-2">About</h1>

            <textarea
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              placeholder="Tell people about yourself, your skills, experience, and what you're passionate about..."
              rows={5}
              maxLength={500}
              className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-3 
               focus:outline-none focus:ring-2 focus:ring-blue-400 
               hover:bg-gray-50 resize-none text-gray-700"
            />

            <div className="text-right text-sm text-gray-500 mt-1">
              {about.length}/500 characters
            </div>
          </div>

          {/* skills */}
          <hr />
          <div>
            <h1 className="text-[19px] font-semibold pl-2">Skills :</h1>

            {skills && (
              <div className="flex flex-wrap gap-[10px] mt-5">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-blue-400 text-white  h-[40px] w-[120px] rounded-full flex items-center justify-center "
                  >
                    {skill}
                    <RxCross2
                      onClick={() => {
                        removeSkill(skill);
                      }}
                      className="ml-[90px] mt-1 absolute bg-blue-900 rounded-full w-4 h-4 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col group-[10px] ">
              <input
                type="text"
                placeholder="Add New Skill"
                maxLength={10}
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="w-full mt-2 border  border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              />
              <button
                onClick={addSkill}
                className=" h-10 w-full border-2 border-[#46b6e6] text-[#46b6e6] shadow-md rounded-full my-[25px] flex items-center justify-center gap-[10px] hover:bg-blue-400 active:scale-95 hover:text-white"
              >
                Add
              </button>
            </div>
          </div>

          {/* education */}
          <hr />
          <div>
            <h1 className="text-[19px] font-semibold pl-2">Education :</h1>

            {education && (
              <div className="flex flex-wrap gap-[10px] mt-5">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className=" bg-blue-400 w-full text-white rounded-md flex items-center pl-3 relative  "
                  >
                    <div>
                      <div>
                        <b className="text-gray-800 pr-14"> collage :</b>{" "}
                        {edu.collage}{" "}
                      </div>
                      <div>
                        <b className="text-gray-800 pr-14"> degree :</b>{" "}
                        {edu.degree}{" "}
                      </div>
                      <div>
                        <b className="text-gray-800 pr-2"> field of study : </b>
                        {edu.fieldOfStudy}{" "}
                      </div>
                    </div>
                    <RxCross2
                      onClick={() => removeEducation(edu)}
                      className="mt-1 bg-blue-900 rounded-full w-5 h-5 cursor-pointer relative ml-auto mr-2"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-[10px]  mt-5">
              <input
                type="text"
                placeholder="Collage"
                value={newEducation.collage}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, collage: e.target.value })
                }
                className="w-full mt-2 border  border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              />

              <input
                type="text"
                placeholder="Degree"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
                className="w-full mt-2 border  border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              />

              <input
                type="text"
                placeholder="Field of study"
                value={newEducation.fieldOfStudy}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldOfStudy: e.target.value,
                  })
                }
                className="w-full mt-2 border  border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              />
              <button
                onClick={addEducation}
                className="h-10 w-full active:scale-95 border-2 border-[#46b6e6] text-[#46b6e6] hover:bg-blue-400 hover:text-white  shadow-md rounded-full my-[25px] flex items-center justify-center gap-[10px]"
              >
                Add
              </button>
            </div>
          </div>

          <hr />
          {/* Experience */}
          <div>
            <h1 className="text-[19px] font-semibold pl-2">Experience :</h1>

            {education && (
              <div className="flex flex-wrap gap-[10px] mt-5">
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className=" bg-blue-400 w-full text-white rounded-md flex items-center pl-3  "
                  >
                    <div>
                      <div>
                        <b className="text-gray-800 pr-16"> Title:</b>{" "}
                        {exp.title}{" "}
                      </div>
                      <div>
                        <b className="text-gray-800 pr-8"> Company:</b>{" "}
                        {exp.company}{" "}
                      </div>
                      <div className="flex">
                        <b className="text-gray-800 pr-5"> Description:</b>
                        <p>{exp.description}</p>{" "}
                      </div>
                    </div>
                    <RxCross2
                      onClick={() => removeExperience(exp)}
                      className="relative ml-auto mr-2 mt-1 bg-blue-900 rounded-full w-5 h-5 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-[10px]  mt-5">
              <input
                type="text"
                placeholder="Title"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                className="w-full mt-2 border  border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              />

              <input
                type="text"
                placeholder="Company"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
                className="w-full mt-2 border  border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              />

              <input
                type="text"
                placeholder="Description"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                className="w-full mt-2 border  border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-100"
              />
              <button
                onClick={addExperience}
                className="h-10 w-full active:scale-95 border-2 border-[#46b6e6] text-[#46b6e6] hover:bg-blue-400 hover:text-white shadow-md rounded-full my-[25px] flex items-center justify-center gap-[10px]"
              >
                Add
              </button>
            </div>
          </div>
          <hr />

          {/* Button */}
          <button
            type="submit"
            className="w-full hover:scale-95 bg-blue-600 hover:bg-blue-800 text-white py-2 rounded-full font-semibold transition"
            onClick={() => handleSaveProfile()}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
