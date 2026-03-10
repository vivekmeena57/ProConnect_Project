import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ meesage: "User does not found",error});
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ meesage: "get current user error",error });
  }
};

//_______________________________________________________________________________________________________

export const updateProfile = async (req, res) => {
  try {
    let { firstName, lastName, userName, headline, location, gender,about } = req.body;
    let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : [];
    let profileImage;
    let coverImage;

    if (req.files.profileImage) {
      profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
    }
    if (req.files.coverImage) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }

    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        userName,
        headline,
        location,
        gender,
        about,
        skills,
        education,
        experience,
        profileImage,
        coverImage,
      },
      { new: true },
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "update Profile Error",error });
  }
};

//___________________________________________________________________________________________________________

export const getProfile = async (req, res) => {
  try {
    let { userName } = req.params;
    console.log(userName);

    let user = await User.findOne({ userName }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "username does not exist" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "get Profile Error",error });
  }
};

// search_____________________________________________________________________________________________________

export const search = async (req, res) => {
  try {
    let { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: `nothing Searched ${error}` });
    }

    let users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { skills: { $in: [query] } },
      ],
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: "search error" });
  }
};

//suggested user______________________________________________________________________________________________

export const getSuggestedUser = async (req, res) => {
  try {
    let currentUser = await User.findById(req.userId).select("connection");
    let suggestedUser = await User.find({
        _id:{ $ne: currentUser,
            $nin: currentUser.connection,}}).select("-password")

   console.log("Suggested:", suggestedUser)
    return res.status(200).json(suggestedUser);
   
  } catch (error) {
    return res.status(400).json({ message: `suggested user error ${error}` });
  }
};
