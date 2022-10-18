"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spotify_repository_1 = __importDefault(require("../repository/spotify-repository"));
const index_1 = require("../utils/index");
//Spotify Business logic
class SpotifyService {
    constructor() {
        this.repository = new spotify_repository_1.default();
    }
    create(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.createDocument(model, data);
            return (0, index_1.formateData)(documentResult);
        });
    }
    getAll(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.getAllDocuments(model);
            return (0, index_1.formateData)(documentResult);
        });
    }
    get(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.getDocumentById(model, id);
            return (0, index_1.formateData)(documentResult);
        });
    }
    filter(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.getDocumentByFilter(model, data);
            return (0, index_1.formateData)(documentResult);
        });
    }
    update(model, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.updateDocument(model, id, data);
            return (0, index_1.formateData)(documentResult);
        });
    }
    updateArray(model, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.updateArrayInDocument(model, id, data);
            return (0, index_1.formateData)(documentResult);
        });
    }
    delete(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.deleteDocument(model, id);
            return (0, index_1.formateData)(documentResult);
        });
    }
    getLibraryPayload(userId, model, libraryId, event, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const library = yield this.repository.getDocumentById(model, libraryId);
            console.log(library);
            if (library) {
                const payload = {
                    event,
                    data: { userId, library, type },
                };
                return (0, index_1.formateData)(payload);
            }
            throw new Error(`${type} does not exist.`);
        });
    }
    //TODO: update playlist
    getPlaylistPayload(userId, model, id, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.repository.getDocumentById(model, id);
            if (playlist) {
                const payload = {
                    event,
                    data: { userId, playlist, id },
                };
                return (0, index_1.formateData)(payload);
            }
            throw new Error("Playlist does not exist.");
        });
    }
}
exports.default = SpotifyService;
