import { model, Schema } from "mongoose";
import ITrack from "../../interfaces/track.interface";

const TrackSchema = new Schema<ITrack>(
	{
		_id: {
			type: String,
		},
		title: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		trackNumber: {
			type: Number,
			required: true,
		},
		trackAudio: {
			type: String,
			// required: true,
		},
		album: {
			type: Schema.Types.String,
			ref: "Album",
			default: undefined,
		},
		image: {
			type: Schema.Types.String,
			default: "https://res.cloudinary.com/juancarlos/image/upload/v1667322269/descarga_xww0ig.jpg"
		},
	},
	{ timestamps: true }
);

const TrackModel = model<ITrack>("Track", TrackSchema);

export default TrackModel;
