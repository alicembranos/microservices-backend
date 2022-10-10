import { model, Schema } from "mongoose";
import IAlbum from "../../interfaces/album.interface";

const AlbumSchema = new Schema<IAlbum>(
	{
		_id: {
			type: String,
		},
		image: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		releaseDate: {
			type: Date,
			required: true,
		},
		totalTracks: {
			type: Number,
			required: true,
		},
		tracks: [
			{
				type: Schema.Types.String,
				ref: "Track",
				default: [],
			},
		],
		artist: {
			type: Schema.Types.String,
			ref: "Artist",
		},
	},
	{ timestamps: true }
);

const AlbumModel = model<IAlbum>("Album", AlbumSchema);

export default AlbumModel;
