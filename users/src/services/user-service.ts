import User from "../repository/user-repository";
import {
	formateData,
	generatePassword,
	generateSignature,
	generateRefreshSignature,
	validatePassword,
} from "../utils/index";
import { Ilogin, ISignUp } from "../interfaces/auth.interface";
import database from "../models/index";
import IAlbum from "../interfaces/album.interface";
import IArtist from "../interfaces/artist.interface";
import ITrack from "../interfaces/track.interface";
import IPlaylist from "../interfaces/playlist.interface";
import { Model } from "mongoose";

//User Business logic
class UserService {
	private repository: User;

	constructor() {
		this.repository = new User();
	}

	async signIn(data: Ilogin) {
		const { email, password } = data;

		const user = await this.repository.getDocumentByField(database.User, email);

		if (!user) {
			return formateData(null);
		}

		const validPassword = await validatePassword(password, user.password);

		if (!validPassword) {
			return formateData(null);
		}

		const token = generateSignature({ sub: user._id, username: user.username });
		const refreshToken = generateRefreshSignature({ sub: user._id, username: user.username });

		// return formateData(token);
		return { token, refreshToken };
	}

	async signUp(data: ISignUp) {
		//TODO: Add genres music preferences
		const { email, password, username, image } = data;

		if (!email || !password || !username || !image) {
			return formateData(null);
		}
		const user = await this.repository.getDocumentByField(database.User, email);

		if (user) {
			return formateData(null);
		}
		const hashPassword = await generatePassword(password);
		const newUser = await this.repository.createDocument(database.User, {
			email,
			password: hashPassword,
			username,
			image,
		});

		const token = generateSignature({ sub: newUser._id, username });
		const refreshToken = generateRefreshSignature({ sub: newUser._id, username });

		// return formateData(token);
		return { token, refreshToken };
	}

	async refreshToken(token: string) {
	if (!token) {
		
	}
	}
	
	async getAll<T>(model: Model<T>) {
		const documentResult = await this.repository.getAllDocuments(model);
		return formateData(documentResult);
	}

	async get<T>(model: Model<T>, id: string) {
		const documentResult = await this.repository.getDocumentById(model, id);
		return formateData(documentResult);
	}

	async update<T>(model: Model<T>, id: string, data: Partial<T>) {
		const documentResult = await this.repository.updateDocument(model, id, data);
		return formateData(documentResult);
	}

	async delete<T>(model: Model<T>, id: string) {
		const documentResult = await this.repository.deleteDocument(model, id);
		return formateData(documentResult);
	}

	async addToLibrary(
		id: string,
		doc: Partial<IAlbum> | Partial<IArtist> | Partial<ITrack>,
		propDocument: string
	) {
		const libraryResult = await this.repository.addDocumentToFavorites(id, doc, propDocument);
		return formateData(libraryResult);
	}

	async addPlaylist(id: string, doc: Partial<IPlaylist>) {
		const userPlaylists = await this.repository.addPlaylist(id, doc);
		return formateData(userPlaylists);
	}

	//? Not needed
	// async updatePlaylist(id: string, doc: Partial<IPlaylist>) {
	// 	const userPlaylists = await this.repository.updatePlaylist(id, doc);
	// 	return formateData(userPlaylists);
	// }

	async removePlaylist(id: string, doc: Partial<IPlaylist>) {
		const userPlaylists = await this.repository.removePlaylist(id, doc);
		return formateData(userPlaylists);
	}

	async subscribeEvents(payload: any) {
		console.log("Triggering... User Events");

		payload = JSON.parse(payload);

		const { event, data } = payload;

		if (!event || !data) return;
		const { userId, playlist, library, type } = data;

		switch (event) {
			case "ADD_TO_LIBRARY":
			case "REMOVE_FROM_LIBRARY":
				this.addToLibrary(userId, library, type);
				break;
			case "ADD_TO_PLAYLIST":
				this.addPlaylist(userId, playlist);
				break;
			// case "UPDATE_PLAYLIST":
			// 	this.updatePlaylist(userId, playlist);
			// 	break;
			case "REMOVE_FROM_PLAYLIST":
				this.removePlaylist(userId, playlist);
				break;
			default:
				break;
		}
	}
}

export default UserService;
