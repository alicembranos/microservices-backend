import User from "../repository/user-repository";
import {
	formateData,
	generatePassword,
	generateSignature,
	generateRefreshSignature,
	validatePassword,
	validateRefreshSignature,
	addTokenToBlacklist,
	deleteUserCacheToken,
	handleError,
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
		
		const user = await this.repository.getDocumentByField(database.User, { email });

		if (!user) throw new Error("User does not exist. Please sign up.");

		console.log("ValidatePassword " , password , '-----' , user.password)
		const validPassword = await validatePassword(password, user.password);
		console.log(validPassword)

		if (!validPassword) throw new Error("Invalid credentials");
		console.log("aqui llego")

		const token = await generateSignature({ sub: user._id, username: user.username });
		
		const refreshToken = await generateRefreshSignature({ sub: user._id, username: user.username });

		return formateData({ token, refreshToken, username: user.username, id : user._id });
	}

	async signUp(data: ISignUp) {
		const { email, password, username, genres } = data;

		if (!email || !password || !username) throw new Error("Invalid credentials");

		//Check if user exist by email
		const user = await this.repository.getDocumentByField(database.User, { email });
		if (user) throw new Error("User already exists");

		//Check if user exist by username
		const usernameExist = await this.repository.getDocumentByField(database.User, { username });
		if (usernameExist) throw new Error("Username is already used. Please select a new one.");

		const hashPassword = await generatePassword(password);
		console.log('Generated Passord ::::::/', hashPassword)
		const newUser = await this.repository.createDocument(database.User, {
			email,
			password: hashPassword,
			username,
			genres,
		});

		const token = await generateSignature({ sub: newUser._id, username });
		const refreshToken = await generateRefreshSignature({ sub: newUser._id, username });

		return formateData({ token, refreshToken, username: newUser.username });
	}

	async refreshToken(token: string) {
		if (!token) throw new Error("Unauthorized.");
		try {
			const { sub, username } = await validateRefreshSignature(token);
			const newToken = await generateSignature({ sub, username });
			return formateData(newToken);
		} catch (error) {
			handleError(error);
		}
	}

	async logout(token: string, refreshToken: string) {
		if (!token) throw new Error("Unauthorized.");
		try {
			const { sub } = await validateRefreshSignature(refreshToken);
			await deleteUserCacheToken(sub);
			await addTokenToBlacklist(token);
			return formateData("Sucesfully logout");
		} catch (error) {
			handleError(error);
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
