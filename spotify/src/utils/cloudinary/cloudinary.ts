import cloudinary, { UploadApiResponse } from "cloudinary";

const cloudinaryAuth = cloudinary.v2;
cloudinaryAuth.config({
	cloud_name: "juancarlos",
	api_key: "741934352396129",
	api_secret: "zJh5VEmeEJEtdsLeuaL5_BrMvj4",
});

const uploadImage = async (file: string): Promise<string | undefined> => {
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

const uploadTrack = async (file: string): Promise<UploadApiResponse | undefined> => {
	return new Promise((resolve, reject) => {
		cloudinaryAuth.uploader.upload(
			`data:image/png;base64,${file}`,
			{ resource_type: "video", folder: "audiofiles/", overwrite: true },
			(error, result) => {
				if (error) {
					console.log("error", error);
					return reject(new Error("Failed to upload file"));
				}
				resolve(result);
			}
		);
	});
};

export { uploadImage, uploadTrack };
