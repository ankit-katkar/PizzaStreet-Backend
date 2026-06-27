import jwt from "jsonwebtoken";
import userAuth from "../models/authModels.js";

const otps = new Map();

const verifyContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.body;

    //validation
    if (!contactNumber) return res.status(400).json({ status: false, message: "Contact number is required" });

    // check use is exist
    let existingUser = await userAuth.findOne({ contactNumber });
    if (!existingUser) {
      existingUser = await userAuth.create({ contactNumber });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    otps.set(contactNumber, otp);
    res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      data: {
        contactNumber,
        otp
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

const verifyOTP = async (req, resp) => {
  const { contactNumber, otp } = req.body;
  const stored = otps.get(contactNumber);
  if (!stored || stored !== otp) {
    return resp.status(400).json({ message: "Invalid or missing OTP" });
  }
  const existingUser = await userAuth.findOne({ contactNumber })
  otps.delete(contactNumber);
  const token = jwt.sign(
    {
      userId: existingUser._id,
      contactNumber: existingUser.contactNumber,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );
  resp.status(200).json({
    message: "Login successful",
    accessToken: token,
    data: {
      contactNumber: contactNumber,
      userName: existingUser.userName || null,
      userRole: existingUser.userRole,
      userId: existingUser._id
    },
    status: true
  });
};

const setProfile = async (req, res) => {
  try {
    const { userId, userRole, contactNumber, userName, email, dateOfBirth, gender } = req.body;

    // Validation
    if (!contactNumber) {
      return res.status(400).json({ status: false, message: "Contact number is required", });
    }
    if (!userName) {
      return res.status(400).json({ status: false, message: "User name is required" });
    }

    let existingUser = await userAuth.findOne({ _id: userId });
    let response = {}
    let message = ""
    if (existingUser) {
      const updateData = {
        contactNumber: contactNumber || existingUser.contactNumber,
        userName: userName || existingUser.userName,
        email: email || existingUser.email,
        dateOfBirth: dateOfBirth || existingUser.dateOfBirth,
        gender: gender || existingUser.gender,
        userRole: userRole || existingUser.userRole
      }
      response = await userAuth.findByIdAndUpdate(userId, updateData, { returnDocument: 'after' })
      message = "User updated Successfully"
    } else {
      const addData = {
        contactNumber,
        userName,
        email: email || null,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null
      }
      response = await addData.save()
      message = "User added successfully"
    }

    res.status(200).json({
      status: true, data: response, message: message,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUserProfile = async (req, resp) => {
  try {
    const { userId } = req.body;

    if (!userId) return resp.status(400).json({ status: false, message: "UserId is required" })
    const exisingUser = await userAuth.findById({ _id: userId })
    resp.status(200).json({ status: true, data: exisingUser, message: "Get user data successfully" })
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });

  }
}

export { verifyContactNumber, verifyOTP, setProfile, getUserProfile };
