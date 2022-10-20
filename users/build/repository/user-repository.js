"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../models/index"));
//Dealing with data base operations
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.createDocument = function (model, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.create(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.prototype.getAllDocuments = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.prototype.getDocumentById = function (model, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.findById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //TODO: Make field generic (not email)
    User.prototype.getDocumentByField = function (model, field) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.findOne(__assign({}, field))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.prototype.updateDocument = function (model, id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = id;
                        return [4 /*yield*/, model.findOneAndUpdate({ _id: _id }, __assign({}, data), { new: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.prototype.deleteDocument = function (model, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.findByIdAndDelete(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //TODO: refactor typescript arguments function
    User.prototype.addDocumentToFavorites = function (userId, doc, propDocument) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, documentLibrary_1, exist_1, profileResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, index_1.default.User.findById(userId)];
                    case 1:
                        profile = (_a.sent());
                        if (!profile) return [3 /*break*/, 3];
                        documentLibrary_1 = profile[propDocument];
                        if (documentLibrary_1.length > 0) {
                            exist_1 = false;
                            documentLibrary_1.map(function (item) {
                                if (item._id === doc._id) {
                                    var index = documentLibrary_1.indexOf(item);
                                    documentLibrary_1.splice(index, 1);
                                    exist_1 = true;
                                }
                            });
                            if (!exist_1) {
                                documentLibrary_1.push(doc);
                            }
                        }
                        else {
                            documentLibrary_1.push(doc);
                        }
                        profile[propDocument] = documentLibrary_1;
                        return [4 /*yield*/, profile.save()];
                    case 2:
                        profileResult = _a.sent();
                        return [2 /*return*/, profileResult[propDocument]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.addPlaylist = function (userId, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, newPlaylists, profileResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, index_1.default.User.findById(userId)];
                    case 1:
                        profile = _a.sent();
                        if (!profile) return [3 /*break*/, 3];
                        newPlaylists = __spreadArray(__spreadArray([], profile.playlists, true), [doc], false);
                        profile.playlists = newPlaylists;
                        return [4 /*yield*/, profile.save()];
                    case 2:
                        profileResult = _a.sent();
                        return [2 /*return*/, profileResult.playlists];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
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
    User.prototype.removePlaylist = function (userId, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, newPlaylists, profileResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, index_1.default.User.findById(userId)];
                    case 1:
                        profile = _a.sent();
                        console.log(profile);
                        console.log(doc);
                        if (!profile) return [3 /*break*/, 3];
                        newPlaylists = profile.playlists.filter(function (item) { var _a; return ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) !== doc._id; });
                        profile.playlists = newPlaylists;
                        return [4 /*yield*/, profile.save()];
                    case 2:
                        profileResult = _a.sent();
                        return [2 /*return*/, profileResult];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return User;
}());
exports.default = User;
