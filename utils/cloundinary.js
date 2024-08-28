const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileToUploads,
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.url,
            resource_type: result.resource_type,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );
  });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      fileToDelete,
      { resource_type: "images" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.url,
            resource_type: result.resource_type,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
