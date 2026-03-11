import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { userDataContext } from "../context/UserContext.jsx";
import ProConnectLogo2 from "../assets/ProConnectLogo2.png";

function SignUp() {
  let [show, setShow] = useState(false);
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData } = useContext(userDataContext);
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, serErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          firstName,
          lastName,
          userName,
          email,
          password,
        },
        { withCredentials: true },
      );
      console.log(result);
      setUserData(result.data);
      navigate("/");
      serErr("");
      setLoading(false);
      setFirstName("");
      setLastName("");
      setUserName("");
      setPassword("");
      setEmail("");
    } catch (error) {
      console.log(error);
      serErr(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className=" bg-[#f3f2ef] min-h-screen">
      <div className="p-[35px] ">
        {/* Logo */}
        <img src={ProConnectLogo2} alt="" className="h-16 w-32" />
      </div>

      <div className=" bg-[#f3f2ef] flex items-center justify-center px-4 mt-8 mb-5 md:mt-0 ">
        <div className="bg-white w-full max-w-md p-10 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-dark-900 text-center mb-6">
            Sign Up
          </h1>

          <form className="space-y-4 " onSubmit={handleSignUp}>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className=" relative ">
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="Password "
                required
                // minLength={6}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <span
                className="absolute right-[20px] top-[9px] text-blue-600 font-semibold cursor-pointer "
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? "Hide" : "Show"}
              </span>
            </div>
            {err && <p className="text-center text-red-500">*{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-full font-semibold transition"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-6">
            By clicking Sign Up, you agree to the Terms, Privacy Policy, and
            Cookies Policy.
          </p>

          <p
            className="text-center text-sm text-gray-700 mt-4  cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Already have an account{" "}
            <span className=" text-blue-700">Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
