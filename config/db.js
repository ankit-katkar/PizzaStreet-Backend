import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
  dotenv.config();
  mongoose.connect(process.env.MONGO_URL )};

export default connectDB;
