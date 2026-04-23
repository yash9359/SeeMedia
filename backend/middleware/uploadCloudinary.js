import multer from 'multer';
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from 'multer-storage-cloudinary';



const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const fileType = file.mimetype.startsWith("video") ? "video" : "image";
        return {
            folder: "SeeMedia",
            resource_type: fileType,
            public_id: Date.now().toString(),
        }
    },


});

const uploadCloudinary = multer({ storage});

export default uploadCloudinary;