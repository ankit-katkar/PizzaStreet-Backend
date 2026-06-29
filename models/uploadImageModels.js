import mongoose from "mongoose"

const uploadImages = mongoose.Schema({
    imageUrl: {
        type: String,
        required: [true, 'Product image is required'],
    },
    imageName: {
        type: String,
        required: [false],
    },
    publicId: {
      type: String,
    },
},
{
    timestamps: true
}
)

const uploadImage = mongoose.model('uploadimages', uploadImages) 

export default uploadImage