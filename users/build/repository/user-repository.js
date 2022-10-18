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
const index_1 = __importDefault(require("../models/index"));
//Dealing with data base operations
class User {
    createDocument(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.create(data);
        });
    }
    getAllDocuments(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.find().lean().exec();
        });
    }
    getDocumentById(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findById(id).lean().exec();
        });
    }
    getDocumentByField(model, field) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findOne(Object.assign({}, field));
        });
    }
    updateDocument(model, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = id;
            return yield model
                .findOneAndUpdate({ _id }, Object.assign({}, data), { new: true })
                .lean()
                .exec();
        });
    }
    deleteDocument(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findByIdAndDelete(id);
        });
    }
    //TODO: refactor typescript arguments function
    addDocumentToFavorites(userId, doc, propDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO: fix type propDocumets(quick shortcut, typed as string)
            const profile = (yield index_1.default.User.findById(userId));
            if (profile) {
                let documentLibrary = profile[propDocument];
                if (documentLibrary.length > 0) {
                    let exist = false;
                    documentLibrary.map((item) => {
                        if (item._id === doc._id) {
                            const index = documentLibrary.indexOf(item);
                            documentLibrary.splice(index, 1);
                            exist = true;
                        }
                    });
                    if (!exist) {
                        documentLibrary.push(doc);
                    }
                }
                else {
                    documentLibrary.push(doc);
                }
                profile[propDocument] = documentLibrary;
                const profileResult = yield profile.save();
                return profileResult[propDocument];
            }
        });
    }
    addPlaylist(userId, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield index_1.default.User.findById(userId);
            if (profile) {
                const newPlaylists = [...profile.playlists, doc];
                profile.playlists = newPlaylists;
                const profileResult = yield profile.save();
                return profileResult.playlists;
            }
        });
    }
    //? Not needed?
    // async updatePlaylist(userId: string, doc: Partial<IPlaylist>) {
    // 	const profile = await database.User.findById(userId);
    // 	if (profile) {
    // 		const newPlaylistArrayUpdated = profile.playlists.map((playlist) => {
    // 			const playlistUpdate = playlist._id === doc._id ? { ...playlist, ...doc } : playlist;
    // 			return playlistUpdate;
    // 		});
    // 		profile.playlists = newPlaylistArrayUpdated;
    // 		const profileResult = await profile.save();
    // 		return profileResult.playlists;
    // 	}
    // }
    removePlaylist(userId, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield index_1.default.User.findById(userId);
            console.log(profile);
            console.log(doc);
            if (profile) {
                const newPlaylists = profile.playlists.filter((item) => { var _a; return ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) !== doc._id; });
                profile.playlists = newPlaylists;
                const profileResult = yield profile.save();
                return profileResult;
            }
        });
    }
}
exports.default = User;
