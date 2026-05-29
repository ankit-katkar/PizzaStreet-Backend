import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    contactNumber: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Provide contact number"],
      match: [/^\+?[0-9]{10,12}$/, "Enter valid contact number"],
    },
    
    userName: {
      type: String,
      trim: true,
    },

    userRole: {
      type: String,
      trim: true,
      enum: ["User", "Admin"],
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter valid email address",],
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      trim: true,
      enum: ["male", "female", "other"],
    },
  },
  {
    timestamps: true,
  }
);

const userAuth = mongoose.model("userList", authSchema);
export default userAuth;
