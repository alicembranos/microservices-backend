import { model, Schema } from "mongoose";
import IArtist from "../../interfaces/artist.interface";

const ArtistSchema = new Schema<IArtist>(
	{
		_id: {
			type: String,
		},
		image: {
			type: String,
			required: true,
		},
		followers: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		popularity: {
			type: Number,
			required: true,
		},
		genres: [
			{
				type: String,
			},
		],
		tracks: [
			{
				type: Schema.Types.String,
				ref: "Track",
				default: [],
			},
		],
		albums: [
			{
				type: Schema.Types.String,
				ref: "Album",
				default: [],
			},
		],
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
	}
);

const ArtistModel = model<IArtist>("Artist", ArtistSchema);

export default ArtistModel;
