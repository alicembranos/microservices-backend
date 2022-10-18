import { model, Schema, SchemaTypes } from "mongoose";
import IUser from "../../interfaces/user.interface";

const UserSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			//TODO: Username must be unique, check it at signup process
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			default: "",
		},
		image: {
			type: String,
		},
		genres: [
			{
				type: String,
				default: [],
			},
		],
		playlists: [
			{
				_id: { type: SchemaTypes.ObjectId, require: true },
				title: { type: String },
				description: { type: String },
				image: { type: String },
			},
		],
		artists: [
			{
				_id: { type: String, require: true },
				image: { type: String },
				name: { type: String },
			},
		],
		albums: [
			{
				_id: { type: String, require: true },
				image: { type: String },
				title: { type: String },
				//! Do I need take every fields?
				artist: { _id: { type: String }, name: { type: String } },
			},
		],
		likedSongs: [
			{
				_id: { type: String, require: true },
				title: { type: String },
				description: { type: String },
				image: { type: String },
				trackAudio: { type: String },
				//! Do I need take every fields?
				album: { _id: { type: String }, title: { type: String } },
			},
		],
	},
	{
		timestamps: true,
		toJSON: {
			transform(_doc, ret) {
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
