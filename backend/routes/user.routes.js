import express, { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser, getProfile, getSuggestedUser, search, updateProfile } from "../controllers/user.controllers.js";
import upload from '../middlewares/multer.js'

let userRouter = express.Router();

userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.put("/saveprofile",isAuth,upload.fields([
    {name:"profileImage",maxCount:1},
    {name:"coverImage",maxCount:1}
]),updateProfile)
userRouter.get("/profile/:userName", isAuth, getProfile);
userRouter.get("/search", isAuth, search);
userRouter.get("/suggestedUsers", isAuth, getSuggestedUser);


export default userRouter;
