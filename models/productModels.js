import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productsSchema = new mongoose.Schema(
  {
    productImage: {
      imageUrl: { type: String, required: [true, "Product image url is required"] },
      imageName: { type: String, required: [true, "Product image name is required"] },
    },

    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
    },

    productPrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [1, "Price must be greater than 0"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },

    discountPrice: {
      type: Number,
      required: false
    },

    foodType:{
      type: String,
      required: [true, 'foodType is required'],
      enum: [
        "VEG",
        "NONVEG"
      ]
    },
 
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "ourSpecial",
        "Pizza",
        "Burger",
        "Desserts",
        "coldDrinks",
      ],
    },

    productStock: {
      type: String,
      required: [true, 'Product stock is required'],
      trim: true,
      enum: [
        "Aveliable",
        "outOfStock"
      ]
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description too long"],
    },
  },
  {
    timestamps: true,
  }
);

productsSchema.plugin(mongoosePaginate)

const Products = mongoose.model("Products", productsSchema);

export default Products;