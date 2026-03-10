import cloudinary from "../config/cloundiary.config.js";
import streamifier from "streamifier";

const uploadToCloudinary=async({resource_type,buffer,folder})=>{
    return new Promise((resolve , reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {folder , resource_type},
            (error , result)=>{
                if(error){
                    return reject(error);
                }
                resolve(result);

            }
        );
          
    //pipe
      streamifier.createReadStream(buffer).pipe(stream);
     })
}

export { uploadToCloudinary };