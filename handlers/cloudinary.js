const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dts4wxk4i',
  api_key: process.env.CLOUDINARY_API_KEY || '498335738472758',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mFI5WNXaJLZAl9AK4imtW7Xc7uw',
});