import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UploadOnClodinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload on clodinary
        const response = await cloudinary.uploader.upload(localFilePath,{
             resource_type:'auto'
        })
        //file uploaded successfully 

        // console.log("file uploaded success:",response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)//this will remove temporaroy file into files
        return null
    }
}
    
export {UploadOnClodinary}