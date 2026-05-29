import productModels from "../models/productModels.js";
import checkoutModels from '../models/checkoutModels.js'

const getProductByCategory = async (req, resp) => {
    try {
        const { category } = req.params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;

        if (!category) return resp.status(200).json({ status: false, message: 'category is requried, provide category' });
        let response = {}
        const validPage = Math.max(page, 1);
        const validLimit = Math.max(limit, 1);
        if (category == 'All') {
            response = await productModels.paginate({}, {
                page: validPage,
                limit: validLimit,
            });
        } else {
            response = await productModels.paginate({ category: category }, {
                page: validPage,
                limit: validLimit,
            });
        }
        resp.status(200).json({
            status: true,
            data: response,
            message: "Product get successfully"
        })
    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
}

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

const getMostSellingProduct = async (req, resp) => {
    try {
        const mostSellingProducts = await checkoutModels.aggregate([
            {
                $group: {
                    _id: "$productId",

                    totalSoldQuantity: {
                        $sum: "$quantity"
                    },

                    productId: {
                        $first: "$productId"
                    },

                    productImage: {
                        $first: "$productImage"
                    },

                    productName: {
                        $first: "$productName"
                    },

                    productPrice: {
                        $first: "$productPrice"
                    },

                    discount: {
                        $first: "$discount"
                    },

                    discountPrice: {
                        $first: "$discountPrice"
                    },

                    foodType: {
                        $first: "$foodType"
                    },

                    category: {
                        $first: "$category"
                    },

                    rating: {
                        $first: "$rating"
                    },

                    description: {
                        $first: "$description"
                    },

                    createdAt: {
                        $first: "$createdAt"
                    },

                    updatedAt: {
                        $first: "$updatedAt"
                    }
                }
            },

            {
                $sort: {
                    totalSoldQuantity: -1
                }
            },
            {
                $limit: 4
            }

        ]);
        resp.status(200).json({ status: true, data: mostSellingProducts, message: "Top 4 most selling products fetched successfully" });
    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
};

const searchProduct = async (req, resp) => {
    try {
        const { searchString } = req.query;

        let filterProduct = {};
        const searchRegex = new RegExp(searchString, 'i')
        filterProduct = {
            $or: [
                { productName: { $regex: searchRegex } },
                { category: { $regex: searchRegex } },
                { foodType: { $regex: searchRegex } },
            ]
        }

        const products = await productModels.find(filterProduct);

        resp.status(200).json({ status: true, data: products, message: "Products fetched successfully" });

    } catch (error) {
        resp.status(500).json({ status: false, message: error.message });
    }
}

export { getProductByCategory, getProductById, getMostSellingProduct, searchProduct }