import express from "express";
import { addToCart, getToCart, removeToCart } from '../controllers/cartController.js'

const router = express.Router();

// Routes
router.post("/addToCart", addToCart);
router.post("/getCartProduct", getToCart);
router.delete("/removeToCart/:productId", removeToCart);

export default router;