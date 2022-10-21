import { Document, Model, Types } from "mongoose";
import IAlbum from "../interfaces/album.interface";
import IArtist from "../interfaces/artist.interface";
import IPlaylist from "../interfaces/playlist.interface";
import ITrack from "../interfaces/track.interface";
import database from "../models/index";

//Dealing with data base operations
class User {
	async createDocument<T>(model: Model<T>, data: T | Partial<T>) {
		return await model.create(data);
	}

	async getAllDocuments<T>(model: Model<T>) {
		return await model.find();
	}

	async getDocumentById<T>(model: Model<T>, id: string) {
		return await model.findById(id);
	}

	async getDocumentByField<T>(model: Model<T>, field: Partial<T>) {
		return await model.findOne({ ...field });
	}

	async updateDocument<T>(model: Model<T>, id: string, data: Partial<T>) {
		const _id = id;
		return await model.findOneAndUpdate({ _id }, { ...data }, { new: true });
	}

	async deleteDocument<T>(model: Model<T>, id: string) {
		return await model.findByIdAndDelete(id);
	}

	async addDocumentToFavorites(
		userId: string,
		doc: Partial<IAlbum> | Partial<IArtist> | Partial<ITrack>,
		propDocument: string
	) {
		const inLibrary = await database.User.findById(userId, {
			[propDocument]: { $elemMatch: { _id: doc._id } },
		});
		console.log(inLibrary, "******************");

		if (!inLibrary) {
			return undefined;
		}

		if (inLibrary) {
			if (inLibrary[propDocument].length > 0) {
				return await database.User.findByIdAndUpdate(
					userId,
					{ $pull: { [propDocument]: { _id: doc._id } } },
					{ new: true, multi: false }
				);
			}
			if (inLibrary[propDocument].length === 0) {
				return await database.User.findByIdAndUpdate(
					userId,
					{ $push: { [propDocument]: doc } },
					{ new: true }
				);
			}
		}
	}

	async addPlaylist(userId: string, doc: Partial<IPlaylist>) {
		const profile = await database.User.findByIdAndUpdate(
			userId,
			{ $push: { playlists: doc } },
			{ new: true }
		);
		if (profile) return profile.playlists;
	}

	async removePlaylist(userId: string, doc: Partial<IPlaylist>) {
		const objectId = new Types.ObjectId(doc._id);
		const profile = await database.User.findByIdAndUpdate(
			userId,
			{ $pull: { playlists: { _id: objectId } } },
			{ new: true, multi: false }
		);
		if (profile) return profile.playlists;
	}

	async updatePlaylist(userId: string, doc: Partial<IPlaylist>) {
		const objectId = new Types.ObjectId(doc._id);
		const profile = await database.User.findByIdAndUpdate(
			userId,
			{ $set: { [`playlists.$[item]`]: doc } },
			{ arrayFilters: [{ "item._id": objectId }] }
		);
		if (profile) return profile.playlists;
	}
}

export default User;
