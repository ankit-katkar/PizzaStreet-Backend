import mongoose from "mongoose";

const cartProdcutSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User ID is required"],
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        contactNumber: {
            type: String,
            trim: true,
            required: [true, "Contact number is required"],
            match: [/^\+?[0-9]{10,12}$/, "Enter valid contact number"],
        },

        productImage: {
            imageUrl: {
                type: String,
                required: [true, "Product image url is required"],
            },
            imageName: {
                type: String,
                required: [true, "Product image name is required"],
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
            required: false,
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

        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description too long"],
        },

        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },
    },
    {
        timestamps: true,
    },
);

const cartProduct = mongoose.model("cartProducts", cartProdcutSchema);

export default cartProduct;
