import cloudinary from 'cloudinary'

const cloudinaryAuth = cloudinary.v2;
cloudinaryAuth.config({ 
  cloud_name: 'juancarlos', 
  api_key: '741934352396129', 
  api_secret: 'zJh5VEmeEJEtdsLeuaL5_BrMvj4' 
});

export default cloudinaryAuth