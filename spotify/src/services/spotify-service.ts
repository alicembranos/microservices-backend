import { Model } from "mongoose";
import Spotify from "../repository/spotify-repository";
import { formateData } from "../utils/index";

//Spotify Business logic
class SpotifyService {
	private repository: Spotify;

	constructor() {
		this.repository = new Spotify();
	}

	async create<T>(model: Model<T>, data: T) {
		const documentResult = await this.repository.createDocument(model, data);
		return formateData(documentResult);
	}

	async getAll<T>(model: Model<T>) {
		const documentResult = await this.repository.getAllDocuments(model);
		return formateData(documentResult);
	}

	async get<T>(model: Model<T>, id: string) {
		const documentResult = await this.repository.getDocumentById(model, id);
		return formateData(documentResult);
	}

	async filter<T>(model: Model<T>, data: Partial<T>) {
		const documentResult = await this.repository.getDocumentByFilter(model, data);
		return formateData(documentResult);
	}

	async update<T>(model: Model<T>, id: string, data: Partial<T>) {
		const documentResult = await this.repository.updateDocument(model, id, data);
		return formateData(documentResult);
	}

	async updateArray<T>(model: Model<T>, id: string, data: Partial<T>) {
		const documentResult = await this.repository.updateArrayInDocument(model, id, data);
		return formateData(documentResult);
	}

	async delete<T>(model: Model<T>, id: string) {
		const documentResult = await this.repository.deleteDocument(model, id);
		return formateData(documentResult);
	}

	async getLibraryPayload<T>(
		userId: string,
		model: Model<T>,
		libraryId: string,
		event: string,
		type: string
	) {
		const library = await this.repository.getDocumentById(model, libraryId);
		console.log(library)
		if (library) {
			const payload = {
				event,
				data: { userId, library, type },
			};
			return formateData(payload);
		}
		throw new Error(`${type} does not exist.`);
	}

	//TODO: update playlist
	async getPlaylistPayload<T>(userId: string, model: Model<T>, id: string, event: string) {
		const playlist = await this.repository.getDocumentById(model, id);

		if (playlist) {
			const payload = {
				event,
				data: { userId, playlist, id },
			};
			return formateData(payload);
		}
		throw new Error("Playlist does not exist.");
	}
}

export default SpotifyService;
