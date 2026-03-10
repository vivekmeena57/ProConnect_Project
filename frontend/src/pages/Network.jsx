import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

function Network() {
  let { serverUrl } = useContext(authDataContext);
  let [connection, setConnection] = useState([]);

  const handleGetRequest = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/requests`, {
        withCredentials: true,
      });
      setConnection(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptConnection = async (requestId) => {
    try {
      let result = await axios.put(
        `${serverUrl}/api/connection/accept/${requestId}`,
        {},
        {
          withCredentials: true,
        },
      );
      setConnection(connection.filter((con) => con._id !== requestId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectConnection = async (requestId) => {
    try {
      let result = await axios.put(
        `${serverUrl}/api/connection/reject/${requestId}`,
        {},
        {
          withCredentials: true,
        },
      );
      setConnection(connection.filter((con) => con._id !== requestId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetRequest();
  }, []);

  return (        
    <div className="w-full min-h-screen bg-[#f0efe7] rounded-lg ">
     <Nav />
      <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-4 text-xl mt-10 rounded-lg shadow-lg mx-auto ">
       <div>Invitations : ({connection.length})</div> 
      </div>

      {connection.length > 0 && (
        <div className="p-2 flex flex-col items-center">
          {connection.map((connection, index) => (
            <div key={index} className="w-full md:w-2/3 lg:w-1/2 bg-white flex justify-between items-center p-3 md:p-5 rounded-lg mt-3 shadow-lg">
              <div className="flex  items-center  ">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mr-5">
                  <img
                    src={connection.sender.profileImage}
                    alt=""
                    className="w-full h-full"
                  />
                </div>

                <div className="text-lg font-semibold">
                  {connection.sender.firstName} {connection.sender.firstName}
                </div>
              </div>

              <div>
                <button
                  className="text-3xl mr-3 text-green-500"
                  onClick={() => handleAcceptConnection(connection._id)}
                >
                  <IoMdCheckmarkCircleOutline />
                </button>
                <button
                  className="text-3xl ml-3 text-red-500"
                  onClick={() => handleRejectConnection(connection._id)}
                >
                  <MdOutlineCancel />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
}

export default Network;
