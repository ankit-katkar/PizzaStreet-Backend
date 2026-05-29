import uploadImageModels from '../models/uploadImageModels.js'

const uploadImage = async (req, resp)=>{
    try {
        const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;
        const addImage = new uploadImageModels({
            imageUrl: imagePath,
            imageName: req.file.originalname
        })
        await addImage.save();
        resp.status(200).json({
            status: true,
            message: 'Product added successfully',
            data:addImage
        })
        
    } catch (error) {
         resp.status(500).json({ status: false, message: error.message });
    }
}

export default uploadImage