import cartModels from '../models/cartModels.js'

const addToCart = async (req, resp) => {
  try {
    const { cartData } = req.body

    if (!cartData || !Array.isArray(cartData)) {
      return resp.status(400).json({
        status: false,
        message: "cartData array is required",
      });
    }

    let message = ""
    for (let data of cartData) {
      const {
        userId,
        productId,
        contactNumber,
        productImage,
        productName,
        productPrice,
        discount,
        discountPrice,
        category,
        foodType,
        description,
        quantity
      } = data

      // Validation 
      if (!userId) return resp.status(400).json({ status: false, message: 'UserId is requried' })
      if (!productId) return resp.status(400).json({ status: false, message: 'productId is requried' })
      if (!contactNumber) return resp.status(400).json({ status: false, message: 'Contact number is requried' })
      if (!productImage) return resp.status(400).json({ status: false, message: 'product image is requried' })
      if (!productName) return resp.status(400).json({ status: false, message: 'product name is requried' })
      if (!productPrice) return resp.status(400).json({ status: false, message: 'product price is requried' })
      if (!discountPrice) return resp.status(400).json({ status: false, message: 'priduct discount price is requried' })
      if (!category) return resp.status(400).json({ status: false, message: 'category is requried' })
      if (!foodType) return resp.status(400).json({ status: false, message: 'foodType is requried' })
      if (!description) return resp.status(400).json({ status: false, message: 'description is requried' })
      if (!quantity) return resp.status(400).json({ status: false, message: 'product quantity is requried' })

      const addProduct = new cartModels({
        userId,
        productId,
        contactNumber,
        productImage,
        productName,
        productPrice,
        discount: discount || null,
        discountPrice,
        category,
        foodType,
        description,
        quantity
      })
      const existingProduct = await cartModels.findOne({ productId, contactNumber })
      if (!existingProduct) {
        await addProduct.save()
        message = "Product added successfully"
      } else {
        const updatedProduct = await cartModels.findOneAndUpdate(
          { productId, contactNumber },
          { $set: { quantity } },
          { returnDocument: 'after' }
        );
        message = "Product updated successfully"
      }
    }
    resp.status(200).json({ status: true, message: message })
  } catch (error) {
    resp.status(500).json({ status: false, message: error.message });
  }
}

const getToCart = async (req, res) => {
  try {
    const { userId } = req.body;
    // Validation
    if (!userId) res.status(400).json({ status: false, message: "UserId is required" });

    const cartData = await cartModels.find({ userId });

    let totalAmount = 0;
    let deliveryCharges = 0;
    let taxes = 0;
    let discount = 0;
    let finalAmount = 0;

    cartData.forEach((item) => {
      const productTotal = item.discountPrice * item.quantity;
      totalAmount += productTotal;
      const getdiscountPrice = item.productPrice - item.discountPrice;
      discount += getdiscountPrice
    });
    const totalAfterDiscount = totalAmount - discount;
    if (totalAfterDiscount < 300) {
      deliveryCharges = 40;
    }
    const getTaxes = totalAmount * 4 / 100;
    taxes = Math.floor(getTaxes)
    finalAmount = totalAfterDiscount + deliveryCharges + taxes;
    if (cartData.length === 0) {
      return res.status(200).json({
        status: true,
        data: [],
        cehckout: {
          totalAmount: 0,
          deliveryCharges: 0,
          taxes: 0,
          discount: 0,
          finalAmount: 0
        },
        message: "Cart is empty",
      });
    } else {
      res.status(200).json({
        status: true,
        data: cartData,
        cehckout: {
          totalAmount,
          deliveryCharges,
          taxes,
          discount,
          finalAmount
        },
        message: "Cart fetched successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const removeToCart = async (req, resp) => {
  try {
    const { productId } = req.params
    if (!productId) resp.status(400).json({ status: false, message: "productId is required" })
    await cartModels.findOneAndDelete(productId)
    resp.status(200).json({
      status: true,
      message: "product deleted sussessfuly"
    })
  } catch (error) {
    resp.status(500).json({ status: false, message: error.message });
  }
}

export { addToCart, getToCart, removeToCart }