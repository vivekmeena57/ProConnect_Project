import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  comment,
  createPost,
  deleteComment,
  deletePost,
  getPost,
  like,
} from "../controllers/post.controllers.js";
import upload from "../middlewares/multer.js";

const postRouter = express.Router();

postRouter.post("/create", isAuth, upload.single("image"), createPost);
postRouter.get("/getpost", isAuth, getPost);
postRouter.delete("/deletepost/:id", isAuth, deletePost);
postRouter.get("/like/:id", isAuth, like);
postRouter.post("/comment/:id", isAuth, comment);
postRouter.delete("/delcomment/:postId/:commentId", isAuth, deleteComment);

export default postRouter;
