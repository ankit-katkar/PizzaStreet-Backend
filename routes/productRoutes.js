import express from 'express'
import { getProductByCategory, getProductById, getMostSellingProduct, searchProduct } from '../controllers/productController.js'

const router = express.Router()

router.get('/get-product-by-category/:category', getProductByCategory)
router.get('/get-product-by-id/:productId', getProductById)
router.get('/most-selling-product', getMostSellingProduct)
router.get('/search-product', searchProduct)

export default router

