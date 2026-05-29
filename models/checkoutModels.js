import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const checkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product ID is required"],
    },

    contactNumber: {
      type: String,
      trim: true,
      required: [true, "Contact number is required"],
      match: [
        /^\+?[0-9]{10,12}$/,
        "Enter valid contact number",
      ],
    },

    productImage: {
      imageUrl: {
        type: String,
        required: [true, "Product image url is required"],
        trim: true,
      },

      imageName: {
        type: String,
        required: [true, "Product image name is required"],
        trim: true,
      },
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
      default: 0,
      min: [0, "Discount price cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: ["OurSpecial", "Pizza", "Burger", "Pasta", "coldDrinks"],
    },

    foodType: {
      type: String,
      required: [true, 'foodType is required'],
      enum: [
        "VEG",
        "NONVEG"
      ]
    },

    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },

    description: {
      type: String,
      trim: true,
    },

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
    },

    emailAddress: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Enter valid email address",
      ],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },

    address1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
      minlength: [5, "Address is too short"],
    },

    address2: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    zipcode: {
      type: String,
      required: [true, "Zipcode is required"],
      trim: true,
      match: [
        /^[0-9]{4,10}$/,
        "Enter valid zipcode",
      ],
    },

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: [
        "COD",
        "CARD",
        "UPI",
      ],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    finalAmount: {
      type: Number,
      required: [true, "Final amount is required"],
      min: [0, "Final amount cannot be negative"],
    },

    rating: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

checkoutSchema.plugin(mongoosePaginate);
const Checkout = mongoose.model("Orders", checkoutSchema);
export default Checkout;