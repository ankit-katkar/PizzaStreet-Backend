import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
  dotenv.config();
  mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
      console.log("Database Name:", mongoose.connection.name);
      console.log("Connected to:", mongoose.connection.name);
      console.log("Host:", mongoose.connection.host);
    })
    .catch((err) => console.error("MongoDB connection error:", err));
};

export default connectDB;
