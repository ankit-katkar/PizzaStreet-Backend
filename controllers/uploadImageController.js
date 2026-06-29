
import uploadImageModels from "../models/uploadImageModels.js";

const UploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Please upload an image",
      });
    }

    const addImage = new uploadImageModels({
      imageUrl: req.file.path,
      publicId: req.file.filename,
      imageName: req.file.originalname,
    });

    await addImage.save();

    res.status(200).json({
      status: true,
      message: "Success",
      data: addImage,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export default UploadImageController;