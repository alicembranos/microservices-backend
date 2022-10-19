import cloudinaryAuth from '../utils/cloudinary/cloudinary'

export async function getSecureCloudinaryUrl({image}){
  console.log(image)
  const {secure_url} = await cloudinaryAuth.uploader.upload(`data:image/png;base64,${image}`, {
    upload_preset: 'photos'
  },function(_error, result) {
    // let result1 = result.secure_url;
    return result;
  }); 

  console.log(secure_url);
  return secure_url
}