import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/profilelogo.jpg";
import moment from "moment";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaCommentDots } from "react-icons/fa6";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import { socket, userDataContex } from "../context/userContex.jsx";
import { TbSend2 } from "react-icons/tb";
import ConnectionButton from "./ConnectionButton.jsx";
import { CiCircleRemove } from "react-icons/ci";

function Post({ id, author, like, comment, description, image, createdAt }) {
  let [more, setMore] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let [likes, setLikes] = useState([]);
  let {
    userData,
    setUserData,
    edit,
    setEdit,
    getPost,
    handleGetProfile,
    postData,
    setPostData,
  } = useContext(userDataContex);
  let [commentContent, setCommentContent] = useState("");
  let [comments, setComments] = useState([]);
  let [showcomment, setshowcomment] = useState(false);
  let [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      let result = await axios.delete(
        serverUrl + `/api/post/deletepost/${id}`,
        { withCredentials: true },
      );
      setPostData((prev) => prev.filter((post) => post._id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      setLikes(result.data.like);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      return;
    }
    try {
      let result = await axios.post(
        serverUrl + `/api/post/comment/${id}`,
        { content: commentContent.trim() },
        {
          withCredentials: true,
        },
      );
      setComments(result.data.comment);
      setCommentContent("");
      console.log(result.data.comment);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        serverUrl + `/api/post/delcomment/${id}/${commentId}`,
        { withCredentials: true },
      );
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) {
        setLikes(likes);
      }
    });

    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId == id) {
        setComments(comm);
      }
    });

    socket.on("commentDeleted", ({ postId, commentId }) => {
      if (postId === id) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId),
        );
      }
    });

    return () => {
      socket.off("likeUpdated");
      socket.off("commentAdded");
      socket.off("commentDeleted");
    };
  }, [id]);

  useEffect(() => {
    setLikes(like);
    setComments(comment);
  }, [like, comment]);

  return (
    <div className="w-full min-h-[200px] bg-white p-5 gap-5 flex flex-col rounded-lg shadow-lg hover:shadow-xl  ">
      <div className="flex justify-between items-center gap-2 ">
        <div className="flex">
          <div
            onClick={() => handleGetProfile(author.userName)}
            className=" w-16 h-16  md:w-16 md:h-16 sm:w-12 sm:h-12   flex-shrink-0 mr-3 rounded-full overflow-hidden items-center justify-center cursor-pointer "
          >
            <img src={author.profileImage || dp} alt="" className=" h-full  " />
          </div>

          <div>
            <div className=" text-lg font-bold ">{`${author.firstName} ${author.lastName}`}</div>
            <div className="text-sm">{author.headline}</div>
            <div className="text-gray-500">{moment(createdAt).fromNow()}</div>
          </div>
        </div>

        {/* button */}

        <div className="flex items-center gap-3">
          {userData?._id === author?._id ? (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 text-sm hover:bg-red-400  hover:text-white border-2 border-red-500 rounded-full px-2 py-1"
            >
              Delete
            </button>
          ) : (
            <ConnectionButton userId={author._id} />
          )}
        </div>
      </div>

      {/* description */}

      <div className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""}`}>
        {description}{" "}
      </div>
      <div
        className="pl-2 text-[17px] text-bold cursor-pointer hover:underline "
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? " Read less..." : "Read more..."}
      </div>

      {image && (
        <div className="w-full  h-[300px] overflow-hidden flex justify-center rounded-lg  ">
          <img src={image} alt="" className="h-full rounded-lg" />
        </div>
      )}

      {/* like comment */}

      <div className="flex justify-between items-center border-b-2 border-gray-500 pb-2 ">
        <div className="flex items-center">
          <BiLike className="text-blue-400 h-5 w-5 " />
          <span className="pl-2">{likes.length}</span>{" "}
        </div>
        <div
          className="cursor-pointer hover:opacity-60 "
          onClick={() => setshowcomment((prev) => !prev)}
        >
          <span> {comments.length}</span> Comments{" "}
        </div>
      </div>

      <div className="flex justify-start items-center w-full  gap-[20px] ">
        {!likes.includes(userData._id) && (
          <div
            onClick={handleLike}
            className="flex  cursor-pointer hover:opacity-60 "
          >
            <BiLike className="h-5 w-5 mt-[3px] mr-2 " />
            <span>Like</span>
          </div>
        )}
        {likes.includes(userData._id) && (
          <div onClick={handleLike} className="flex cursor-pointer">
            <BiSolidLike className="h-5 w-5 mt-[3px] mr-2 text-blue-400" />
            <span className="text-blue-400">Liked</span>
          </div>
        )}

        <div
          onClick={() => setshowcomment((prev) => !prev)}
          className="flex cursor-pointer hover:opacity-60"
        >
          <FaCommentDots className="mt-1 mr-2" /> <span>Comment</span>{" "}
        </div>
      </div>

      <div>
        {showcomment && (
          <form
            onSubmit={handleComment}
            className="w-full flex justify-between items-center border-b-2 border-gray-300"
          >
            <input
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              type="text"
              placeholder="Leave a comment ..."
              className="outline-none border-none w-full pr-3"
            />
            <button disabled={!commentContent.trim()}>
              <TbSend2
                className={` ${commentContent.trim() ? "text-blue-400" : "text-gray-300"} w-6 h-6 mb-2 mr-5`}
              />
            </button>
          </form>
        )}

        {showcomment && (
          <div className="mt-5 ">
            {comments.map((com, index) => (
              <div
                key={index}
                className=" bg-gray-100 p-2 rounded-md mt-2 flex justify-between items-center"
              >
                <div>
                  <div className="w-full flex justify-start items-center ">
                    <div className="w-10 h-10 rounded-full overflow-hidden  ">
                      <img
                        src={com.user.profileImage || dp}
                        className="w-full h-full "
                      />
                    </div>

                    <div className="text-sm font-semibold ml-2">
                      {`${com.user.firstName} ${com.user.lastName}`}
                      <div className="text-gray-500 text-sm pl-1  ">
                        {moment(com.createdAt).fromNow()}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="pl-12 pt-2">{com.content}</div>
                </div>

                <div>
                  {com.user._id === userData._id && (
                    <button
                      onClick={() => handleDeleteComment(com._id)}
                      className="text-red-500 text-xs hover:scale-105 "
                    >
                      <CiCircleRemove className="h-7 w-7" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[350px] shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Delete Post?</h2>

            <p className="text-gray-600 mb-6">This action cannot be undone.</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
