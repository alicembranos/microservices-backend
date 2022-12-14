import { Model } from "mongoose";
import Spotify from "../repository/spotify-repository";
import { formateData } from "../utils/index";
import IPlaylist from "../interfaces/playlist.interface";
import ITrack from "interfaces/track.interface";

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

	async search<T>(model: Model<T>, data: string) {
		const documentResult = await this.repository.getDocumentBySearch(model, data);
		return documentResult;
	}

	async update<T>(model: Model<T>, id: string, data: Partial<T>) {
		const documentResult = await this.repository.updateDocument(model, id, data);
		return formateData(documentResult);
	}

	async updateFromArray<T>(model: Model<T>, id: string, data: Partial<T>) {
		const documentResult = await this.repository.updateArrayInDocument(model, id, data);
		return formateData(documentResult);
	}

	async delete<T>(model: Model<T>, id: string) {
		const documentResult = await this.repository.deleteDocument(model, id);
		return formateData(documentResult);
	}

	async deleteFromArray(model: Model<IPlaylist>, id: string, data: string) {
		const document = await this.repository.getDocumentById(model, id);
		if (document !== undefined) {
			const selectedArrayDocument = document?.tracks as ITrack[];
			for (let index = 0; index < selectedArrayDocument.length; index++) {
				if (selectedArrayDocument[index]._id.toString() === data) {
					selectedArrayDocument?.splice(index, 1);
					break;
				}
			}
			const documentResult = await this.repository.deleteFromArrayInDocument(
				model,
				id,
				selectedArrayDocument
			);
			return formateData(documentResult);
		}
		throw new Error("Deleted not suceeded");
	}

	async getLibraryPayload<T>(
		userId: string,
		model: Model<T>,
		libraryId: string,
		event: string,
		type: string
	) {
		const library = await this.repository.getDocumentById(model, libraryId);
		if (library) {
			const payload = {
				event,
				data: { userId, library, type },
			};
			return formateData(payload);
		}
		throw new Error(`${type} does not exist.`);
	}

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
