import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFileLPath) => {
    try {
        if(!localFileLPath) return null;
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFileLPath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        //console.log('file uploaded successfully ', response.url);
        fs.unlinkSync(localFileLPath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFileLPath) // remove the locally saved temporay file as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }