import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    let { description } = req.body;
    let newPost;

    if (!description.trim()) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    if (req.file) {
      let image = await uploadOnCloudinary(req.file.path);
      newPost = await Post.create({
        author: req.userId,
        description,
        image,
      });
    } else {
      newPost = await Post.create({
        author: req.userId,
        description,
      });
    }

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json(error);
  }
};
//______________________________________________________________________________

export const deletePost = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);
    io.emit("postDeleted", { postId });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete post error", error });
  }
};

//_____________________________________________________________________________

export const getPost = async (req, res) => {
  try {
    let post = await Post.find()
      .populate("author", "firstName lastName profileImage headline userName")
      .populate("comment.user", "firstName lastName profileImage headline")
      .sort({ createdAt: -1 });

    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "getPost error" });
  }
};

//_____________________________________________________________________

export const like = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    if (post.like.includes(userId)) {
      post.like = post.like.filter((id) => id != userId);
    } else {
      post.like.push(userId);

      if (post.author != userId) {
        let notification = Notification.create({
          receiver: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });
      }
    }
    await post.save();
    io.emit("likeUpdated", { postId, likes: post.like });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "like error", error });
  }
};

//________________________________________________________________________________________________________

export const comment = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let { content } = req.body;

    if (!req.body.content || !req.body.content.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    let post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comment: { content, user: userId } },
      },
      { new: true },
    ).populate("comment.user", "firstName lastName profileImage headline");

    if (post.author != userId) {
      let notification = Notification.create({
        receiver: post.author,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId,
      });
    }

    io.emit("commentAdded", { postId, comm: post.comment });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "comment error", error });
  }
};

//______________________________________________________________________


export const deleteComment = async (req,res) =>{
  try {
     let {postId,commentId} = req.params;
     const userId = req.userId;

     const post = await Post.findById(postId);  
  
     if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

     const comment = post.comment.id(commentId);

     if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

     if (comment.user.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

     comment.deleteOne();
    await post.save();

     io.emit("commentDeleted", { postId, commentId });

    return res.status(200).json({ message: "Comment deleted" })

  } catch (error) {
      return res.status(500).json({ message: "Delete comment error", error });
  }
}
