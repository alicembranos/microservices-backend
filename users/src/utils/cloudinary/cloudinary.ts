import cloudinary from "cloudinary";

const cloudinaryAuth = cloudinary.v2;
cloudinaryAuth.config({
	cloud_name: "juancarlos",
	api_key: "741934352396129",
	api_secret: "zJh5VEmeEJEtdsLeuaL5_BrMvj4",
});

export const uploadToCloudinary = async (file: string): Promise<string | undefined> => {
	return new Promise((resolve, reject) => {
		cloudinaryAuth.uploader.upload(
			`data:image/png;base64,${file}`,
			{
				upload_preset: "photos",
			},
			(error, result) => {
				if (error) {
					console.log("error", error);
					return reject(new Error("Failed to upload file"));
				}
				resolve(result?.secure_url);
			}
		);
	});
};

export default uploadToCloudinary;
