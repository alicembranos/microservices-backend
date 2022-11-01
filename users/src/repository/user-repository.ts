import { AnyKeys, Model, Types, AnyObject } from "mongoose";
import IAlbum from "../interfaces/album.interface";
import IArtist from "../interfaces/artist.interface";
import IPlaylist from "../interfaces/playlist.interface";
import ITrack from "../interfaces/track.interface";
import database from "../models/index";
import IChat from "../interfaces/chat.interface";
import IUser from "../interfaces/user.interface";

//Dealing with data base operations
class User {
	async createDocument<T>(model: Model<T>, data: T | Partial<T>) {
		return await model.create(data);
	}

	async getAllDocuments<T>(model: Model<T>) {
		return await model.find();
	}

	async getDocumentById<T>(model: Model<T>, id: IUser | Types.ObjectId | string) {
		return await model.findById(id);
	}

	async getDocumentByField<T>(model: Model<T>, field: Partial<T>) {
		return await model.findOne({ ...field });
	}

	async updateDocument<T>(model: Model<T>, id: string, data: Partial<T>) {
		const _id = id;
		return await model.findOneAndUpdate({ _id }, { ...data }, { new: true });
	}

	async updateDocumentById<T>(model: Model<T>, id: string, data: Partial<T> | IChat[], property: keyof IUser) {

		const profile = await model.findByIdAndUpdate(
			id,
			{ $set: { [property]: data } as AnyKeys<T> & AnyObject },
			{ new: true }
		);
		if (profile) return profile[property];
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

	//! If works, make it generic with addPlaylist
	async addChat<T>(
		model: Model<T>,
		userId: IUser | Types.ObjectId | string,
		doc: any,
		property: keyof IUser
	) {
		const profile = await model.findByIdAndUpdate(
			userId,
			{ $push: { [property]: doc } as AnyKeys<T> & AnyObject },
			{ new: true }
		);
		if (profile) return profile[property];
	}

	async addMessageToChat<
		T extends {
			chats: IChat[];
		}
	>(
		model: Model<T>,
		userId: IUser | Types.ObjectId | string,
		doc: string[],
		toUserId: IUser | Types.ObjectId | string,
		property: keyof IChat
	) {
		const profile = await model.findByIdAndUpdate(
			userId,
			{ $push: { [`chats.$[outer].${property}`]: doc } as AnyKeys<T> & AnyObject },
			{ arrayFilters: [{ "outer.toUser": toUserId }], new: true }
		);
		if (profile) return profile.chats;
	}

	async updateNestedObjectInArrayNotEqual<
		T extends {
			chats: IChat[];
		}
	>(
		model: Model<T>,
		userId: IUser | Types.ObjectId | string,
		value: boolean,
		toUserId: IUser | Types.ObjectId | string,
		propertyA: keyof IUser,
		propertyB: keyof IChat
	) {
		const profile = await model.findByIdAndUpdate(
			userId,
			{ $set: { [`${propertyA}.$[outer].${propertyB}`]: value } as AnyKeys<T> & AnyObject },
			{ arrayFilters: [{ "outer.toUser": { $ne: toUserId } }], new: true }
		);
		if (profile) return profile[propertyA];
	}

	async updateNestedObjectInArrayBoolean<
		T extends {
			chats: IChat[];
		}
	>(
		model: Model<T>,
		userId: IUser | Types.ObjectId | string,
		value: boolean,
		toUserId: IUser | Types.ObjectId | string,
		propertyA: keyof IUser,
		propertyB: keyof IChat
	) {
		const profile = await model.findByIdAndUpdate(
			userId,
			{ $set: { [`${propertyA}.$[outer].${propertyB}`]: value } as AnyKeys<T> & AnyObject },
			{ arrayFilters: [{ "outer.toUser": toUserId }], new: true }
		);
		if (profile) return profile[propertyA];
	}

	async updateNestedObjectInArray<
		T extends {
			chats: IChat[];
		}
	>(
		model: Model<T>,
		userId: IUser | Types.ObjectId | string,
		toUserId: IUser | Types.ObjectId | string,
		propertyA: keyof IUser,
		propertyB: keyof IChat
	) {
		const profile = await model.findByIdAndUpdate(
			userId,
			{ $inc: { [`${propertyA}.$[outer].${propertyB}`]: 1 } as AnyKeys<T> & AnyObject },
			{ arrayFilters: [{ "outer.toUser": toUserId }], new: true }
		);
		if (profile) return profile[propertyA];
	}
}

export default User;
