import { model, Schema } from "mongoose";
import IPlaylist from "../../interfaces/playlist.interface";

const PlaylistSchema = new Schema<IPlaylist>(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			unique: true,
		},
		description: {
			type: String,
		},
		image: {
			type: String,
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
		tracks: [
			{
				type: Schema.Types.String,
				ref: "Track",
				default: [],
			},
		],
		userId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true } //*get year of the playlist with createdAt field
);

const PlaylistModel = model<IPlaylist>("Playlist", PlaylistSchema);

export default PlaylistModel;
