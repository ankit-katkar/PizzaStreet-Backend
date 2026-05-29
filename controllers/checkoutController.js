import mongoose from "mongoose";
import checkoutModels from "../models/checkoutModels.js";
import cartModels from "../models/cartModels.js";
import userAuth from "../models/authModels.js";

const placeOrder = async (req, resp) => {
  try {
    const {
      productList,
      userId,
      firstName,
      lastName,
      emailAddress,
      country,
      contactNumber,
      address1,
      address2,
      city,
      zipcode,
      paymentMethod,
      totalAmount,
      finalAmount,
    } = req.body;

    const formattedNumber = contactNumber.replace(/^0+/, "");

    const savedOrders = [];

    for (const item of productList) {
      const order = new checkoutModels({
        userId,
        productId: item.productId,
        productImage: item.productImage,
        productName: item.productName,
        productPrice: item.productPrice,
        discount: item.discount,
        discountPrice: item.discountPrice,
        category: item.category,
        foodType: item.foodType,
        quantity: item.quantity,
        description: item.description,
        firstName,
        lastName,
        emailAddress,
        country,
        contactNumber: formattedNumber,
        address1,
        address2,
        city,
        zipcode,
        paymentMethod,
        totalAmount,
        finalAmount,
      });

      await order.save();
      savedOrders.push(order);
    }

    const productIds = productList.map((item) => new mongoose.Types.ObjectId(item.productId));

    const deletedProducts = await cartModels.deleteMany({
      contactNumber: formattedNumber,
      productId: {
        $in: productIds,
      },
    });

    resp.status(200).json({ status: true, data: savedOrders, message: "Order placed successfully" });

  } catch (error) {
    resp.status(500).json({ status: false, message: error.message });
  }
};


const getUserOrder = async (req, resp) => {
  try {

    const { userId } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!userId) return resp.status(400).json({ status: false, message: "UserId is required" });

    const filterQuery = { userId };

    const userOrder = await checkoutModels.paginate(filterQuery, {
      page,
      limit,
      sort: { createdAt: -1 },
    }
    );

    resp.status(200).json({
      status: true,
      data: {
        docs: userOrder.docs,
        totalDocs: userOrder.totalDocs,
        limit: userOrder.limit,
        totalPages: userOrder.totalPages,
        page: userOrder.page,
        pagingCounter: userOrder.pagingCounter,
        hasPrevPage: userOrder.hasPrevPage,
        hasNextPage: userOrder.hasNextPage,
        prevPage: userOrder.prevPage,
        nextPage: userOrder.nextPage,
      },
      message: "User order data get successfully",
    });

  } catch (error) {
    resp.status(500).json({ status: false, message: error.message });
  }
};

const setProductRating = async (req, resp) => {
  try {
    const { userId, productId, rating } = req.body
    

    if (!userId) return resp.status(400).json({ status: false, message: 'User id is required' })
    if (!productId) return resp.status(400).json({ status: false, message: 'Product id is required' })
    if (!rating) return resp.status(400).json({ status: false, message: 'Rating is required' })
    if (rating < 1 || rating > 5) return resp.status(400).json({ status: false, message: "Rating must be between 1 to 5" });

    const ratingValue = Number(rating);
    const existingProduct = await checkoutModels.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId)
      },
      { $set: { rating: ratingValue } },
      { returnDocument: 'after' })

    resp.status(200).json({ status: true, message: 'Rating added successfully' })
  } catch (error) {
    resp.status(500).json({ status: false, message: error.message });
  }
}

export { placeOrder, getUserOrder, setProductRating };
