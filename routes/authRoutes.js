import express from "express";
import { verifyContactNumber, verifyOTP, setProfile, getUserProfile } from "../controllers/authController.js";

const router = express.Router();

// Routes
router.post("/verifyContactNumber", verifyContactNumber);
router.post("/verifyOTP", verifyOTP);
router.post("/setProfile", setProfile);
router.post("/getUserProfile", getUserProfile);

export default router;