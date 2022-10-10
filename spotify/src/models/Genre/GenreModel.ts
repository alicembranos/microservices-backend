import { model, Schema } from "mongoose";
import IGenre from "../../interfaces/genre.interface";

const GenreSchema = new Schema<IGenre>(
	{
		name: {
			type: String,
			trim: true,
			lowercase: true,
		},
	},
	{ timestamps: true }
);

const GenreModel = model("Genre", GenreSchema);

export default GenreModel;