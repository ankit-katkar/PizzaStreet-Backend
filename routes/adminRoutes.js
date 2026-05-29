import express from 'express'
import { addProduct, getProduct, getProductById, updateProduct, deleteProduct, dashboardDetail } from '../controllers/adminProductController.js'

const router = express.Router()

router.get('/get-product', getProduct)
router.get('/get-product-by-id/:productId', getProductById)
router.get('/dashboard-detail', dashboardDetail)

router.post('/add-product', addProduct)

router.put('/update-product/:productId', updateProduct)

router.delete('/delete-product/:productId', deleteProduct)

export default router