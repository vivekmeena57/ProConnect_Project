import mongoose from "mongoose";

const connetDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected");
  } catch (error) {
    console.log("db error", error);
  }
};

export default connetDB;
