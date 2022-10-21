import cloudinary from "cloudinary";
import { NextFunction } from "express";

const cloudinaryAuth = cloudinary.v2;
cloudinaryAuth.config({
	cloud_name: "juancarlos",
	api_key: "741934352396129",
	api_secret: "zJh5VEmeEJEtdsLeuaL5_BrMvj4",
});

const uploadToCloudinary = async (image: string, next: NextFunction): Promise<string> => {
	const { secure_url } = await cloudinaryAuth.uploader.upload(
		`data:image/png;base64,${image}`,
		{
			upload_preset: "photos",
		},
		function (error, result) {
			if (error) next(error);
			return result;
		}
	);
	return secure_url;
};

export default uploadToCloudinary;
