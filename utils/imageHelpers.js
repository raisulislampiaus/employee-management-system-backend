import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const resizeImage = async (buffer) => {
  try {
    return await sharp(buffer)
      .resize({ width: 300 }) 
      .toBuffer();
  } catch (error) {
    throw new Error('Error resizing image');
  }
};


export const uploadToCloudinary = async (buffer) => {
  try {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(buffer);
    });
  } catch (error) {
    throw new Error('Error uploading image to Cloudinary');
  }
};
