import productModels from "../models/productModels.js";
import uploadImageModels from '../models/uploadImageModels.js'
import cartModels from '../models/cartModels.js'
import CheckoutModels from "../models/checkoutModels.js";
import authModels from '../models/authModels.js'
import fs from 'fs'
import path from 'path'
import cloudinary from "../config/cloudinary.js";

const addProduct = async (req, resp) => {
    try {
        const { productImage, productName, productPrice, discount, category, foodType, productStock, description } = req.body;

        // handleError
        if (!productImage) resp.status(400).json({ status: false, message: "Product image is required" });
        if (!productName) resp.status(400).json({ status: false, message: "Product name is required" });
        if (!productPrice) resp.status(400).json({ status: false, message: "Product price is required" });
        if (!category) resp.status(400).json({ status: false, message: "category is required" });
        if (!foodType) resp.status(400).json({ status: false, message: "foodType is required" });
        if (!productStock) resp.status(400).json({ status: false, message: "product stock is required" });
        if (!description) resp.status(400).json({ status: false, message: "description is required" });

        const calculatePrice = (productPrice * discount) / 100;
        const discountAmount = productPrice - calculatePrice;

        const addProduct = new productModels({
            productImage,
            productName,
            productPrice,
            discount: discount || 0,
            discountPrice: Math.round(discountAmount).toFixed(2),
            category,
            foodType,
            productStock,
            description,
        });
        await addProduct.save();
        resp.status(200).json({
            status: true,
            data: addProduct,
            message: "product added successfuly",
        });
    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
};

const getProduct = async (req, resp) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;

        const searchString = req.query.searchString;
        const searchProduct = (searchString && searchString != 'null') ? searchString.trim('') : '';

        let filterProduct = {}
        if (searchProduct != null) {
            const searchRegex = new RegExp(searchProduct, 'i')
            filterProduct = {
                $or: [
                    { productName: { $regex: searchRegex } },
                    { category: { $regex: searchRegex } },
                    { productStock: { $regex: searchRegex } },
                ]
            }
        }

        const validPage = Math.max(page, 1);
        const validLimit = Math.max(limit, 1);
        const getProductData = await productModels.paginate(filterProduct, {
            page: validPage,
            limit: validLimit,
            sort: {
                createdAt: -1
            }
        });

        resp.status(200).json({
            status: true,
            message: 'Product data get successfully',
            data: getProductData
        });
    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
};

const getProductById = async (req, resp) => {
    try {
        const { productId } = req.params

        if (!productId) resp.status(400).json({ status: false, message: "product id is required" });

        if (productId) {
            const getProduct = await productModels.findById(productId)
            resp.status(200).json({
                status: true,
                data: getProduct,
                message: "product get successfuly"
            })
        }
    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
}

const updateProduct = async (req, resp) => {
    try {
        const { productId } = req.params
        const { productImage, productName, productPrice, discount, category, foodType, productStock, description } = req.body;

        // handleError
        if (!productImage) resp.status(400).json({ status: false, message: "Product image is required" });
        if (!productName) resp.status(400).json({ status: false, message: "Product name is required" });
        if (!productPrice) resp.status(400).json({ status: false, message: "Product price is required" });
        if (!category) resp.status(400).json({ status: false, message: "category is required" });
        if (!foodType) resp.status(400).json({ status: false, message: "foodType is required" });
        if (!productStock) resp.status(400).json({ status: false, message: "product stock is required" });
        if (!description) resp.status(400).json({ status: false, message: "description is required" });

        const existingProduct = await productModels.findById(productId)
        if (!existingProduct) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }

        const calculatePrice = (productPrice * discount) / 100;
        const discountAmount = productPrice - calculatePrice;

        const updateData = {
            productImage: productImage || existingProduct.productImage,
            productName: productName || existingProduct.productName,
            productPrice: productPrice || existingProduct.productPrice,
            discount: discount || existingProduct.discount,
            discountPrice: Math.round(discountAmount).toFixed(2),
            category: category || existingProduct.category,
            foodType: foodType || existingProduct.foodType,
            productStock: productStock || existingProduct.productStock,
            description: description || existingProduct.description,
        }

        const updateProduct = await productModels.findByIdAndUpdate(productId, updateData, { returnDocument: 'after' })
        resp.status(200).json({
            status: true,
            message: 'Product updated successfully',
            data: updateProduct
        })
    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
};

const deleteProduct = async (req, resp) => {
    try {
        const { productId } = req.params;

        if (!productId) return resp.status(400).json({ status: false, message: "Product id is required" });

        const findProduct = await productModels.findById(productId);

        if (!findProduct) return resp.status(404).json({ status: false, message: "Product not found" });

        const productImage = await uploadImageModels.findOne({
            imageUrl: findProduct.productImage.imageUrl,
        });

        if (productImage) {
            const result = await cloudinary.uploader.destroy(productImage.publicId);

            await uploadImageModels.findByIdAndDelete(productImage._id)
        }
        await productModels.findByIdAndDelete(productId);
        await cartModels.deleteMany({ productId });

        resp.status(200).json({ status: true, message: "Product deleted successfully", });

    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
};

const dashboardDetail = async (req, resp) => {
    try {
        const totalProductCount = await productModels.countDocuments();
        const totalOrdersCount = await CheckoutModels.countDocuments();
        const totalUserCount = await authModels.countDocuments();

        const revenueCount =
            await CheckoutModels.aggregate([
                {
                    $group: {
                        _id: null,

                        totalRevenue: {
                            $sum: "$finalAmount",
                        },
                    },
                },
            ]);
        const totalRevenueCount = revenueCount[0].totalRevenue;

        const dashboardData = {
            totalProduct: totalProductCount,
            totalOrders: totalOrdersCount,
            totalRevenue: totalRevenueCount,
            totalUsers: totalUserCount
        }
        resp.status(200).json({ status: true, data: dashboardData, message: "Dashboard data get successfully" })
    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
}

export { addProduct, getProduct, getProductById, updateProduct, deleteProduct, dashboardDetail };
