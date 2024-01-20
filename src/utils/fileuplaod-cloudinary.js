import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';// Read more on fs docs
          
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  const uploadCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        // file has been uploaded successfully
        console.log(`File is uploaded on Cloudinary`, response.url);
        console.log(`complete details`, response);
        return response;
    } catch (error) {
        // fs.unlink
        fs.unlinkSync(localFilePath) // remove the locally saved temporary  saved file as the upload operation got failed
        return null
    }
  }
// temperory code
//   cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });


export {uploadCloudinary}