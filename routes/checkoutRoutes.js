import express from "express";
import { placeOrder, getUserOrder, setProductRating } from '../controllers/checkoutController.js'

const router = express.Router();

// Routes
router.post("/checkoutOrder", placeOrder);
router.post("/userOrder", getUserOrder);
router.post("/setProductRating", setProductRating);

export default router;