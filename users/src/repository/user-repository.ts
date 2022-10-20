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

	//TODO: Make field generic (not email)
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

	//TODO: refactor typescript arguments function
	async addDocumentToFavorites(
		userId: string,
		doc: Partial<IAlbum> | Partial<IArtist> | Partial<ITrack>,
		propDocument: string
	) {
		//TODO: fix type propDocumets(quick shortcut, typed as string)
		const profile = (await database.User.findById(userId)) as Document;

		if (profile) {
			let documentLibrary = profile[propDocument];
			type ArrayObject = typeof documentLibrary;
			type Unpacked<T> = T extends (infer U)[] ? U : T;
			if (documentLibrary.length > 0) {
				let exist = false;
				documentLibrary.map((item: Unpacked<ArrayObject>) => {
					if (item._id === doc._id) {
						const index = documentLibrary.indexOf(item);
						documentLibrary.splice(index, 1);
						exist = true;
					}
				});

				if (!exist) {
					documentLibrary.push(doc);
				}
			} else {
				documentLibrary.push(doc);
			}
			profile[propDocument] = documentLibrary;

			const profileResult = await profile.save();

			return profileResult[propDocument];
		}
	}

	async addPlaylist(userId: string, doc: Partial<IPlaylist>) {
		const profile = await database.User.findById(userId);
		if (profile) {
			const newPlaylists = [...profile.playlists, doc];
			profile.playlists = newPlaylists;
			const profileResult = await profile.save();

			return profileResult.playlists;
		}
	}

	async removePlaylist(userId: string, doc: Partial<IPlaylist>) {
		const profile = await database.User.findById(userId);
		console.log(profile);
		console.log(doc);
		if (profile) {
			const newPlaylists = profile.playlists.filter(
				(item: Partial<IPlaylist>) => item._id?.toString() !== doc._id
			);
			profile.playlists = newPlaylists;
			const profileResult = await profile.save();

			return profileResult;
		}
	}
}

export default User;
