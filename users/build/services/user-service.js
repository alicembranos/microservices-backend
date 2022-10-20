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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_repository_1 = __importDefault(require("../repository/user-repository"));
var index_1 = require("../utils/index");
var index_2 = __importDefault(require("../models/index"));
//User Business logic
var UserService = /** @class */ (function () {
    function UserService() {
        this.repository = new user_repository_1.default();
    }
    UserService.prototype.signIn = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, user, validPassword, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = data.email, password = data.password;
                        return [4 /*yield*/, this.repository.getDocumentByField(index_2.default.User, { email: email })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User does not exist. Please sign up.");
                        return [4 /*yield*/, (0, index_1.validatePassword)(password, user.password)];
                    case 2:
                        validPassword = _a.sent();
                        if (!validPassword)
                            throw new Error("Invalid credentials");
                        return [4 /*yield*/, (0, index_1.generateSignature)({ sub: user._id, username: user.username })];
                    case 3:
                        token = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)({ token: token, username: user.username })];
                }
            });
        });
    };
    UserService.prototype.signUp = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, username, user, usernameExist, hashPassword, newUser, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = data.email, password = data.password, username = data.username;
                        if (!email || !password || !username)
                            throw new Error("Invalid credentials");
                        return [4 /*yield*/, this.repository.getDocumentByField(index_2.default.User, { email: email })];
                    case 1:
                        user = _a.sent();
                        if (user)
                            throw new Error("User already exists");
                        return [4 /*yield*/, this.repository.getDocumentByField(index_2.default.User, { username: username })];
                    case 2:
                        usernameExist = _a.sent();
                        if (usernameExist)
                            throw new Error("Username is already used. Please select a new one.");
                        return [4 /*yield*/, (0, index_1.generatePassword)(password)];
                    case 3:
                        hashPassword = _a.sent();
                        return [4 /*yield*/, this.repository.createDocument(index_2.default.User, {
                                email: email,
                                password: hashPassword,
                                username: username,
                            })];
                    case 4:
                        newUser = _a.sent();
                        return [4 /*yield*/, (0, index_1.generateSignature)({ sub: newUser._id, username: username })];
                    case 5:
                        token = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)({ token: token, username: newUser.username })];
                }
            });
        });
    };
    UserService.prototype.getAll = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var documentResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getAllDocuments(model)];
                    case 1:
                        documentResult = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(documentResult)];
                }
            });
        });
    };
    UserService.prototype.get = function (model, id) {
        return __awaiter(this, void 0, void 0, function () {
            var documentResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getDocumentById(model, id)];
                    case 1:
                        documentResult = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(documentResult)];
                }
            });
        });
    };
    UserService.prototype.update = function (model, id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var documentResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.updateDocument(model, id, data)];
                    case 1:
                        documentResult = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(documentResult)];
                }
            });
        });
    };
    UserService.prototype.delete = function (model, id) {
        return __awaiter(this, void 0, void 0, function () {
            var documentResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.deleteDocument(model, id)];
                    case 1:
                        documentResult = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(documentResult)];
                }
            });
        });
    };
    UserService.prototype.addToLibrary = function (id, doc, propDocument) {
        return __awaiter(this, void 0, void 0, function () {
            var libraryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.addDocumentToFavorites(id, doc, propDocument)];
                    case 1:
                        libraryResult = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(libraryResult)];
                }
            });
        });
    };
    UserService.prototype.addPlaylist = function (id, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var userPlaylists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.addPlaylist(id, doc)];
                    case 1:
                        userPlaylists = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(userPlaylists)];
                }
            });
        });
    };
    UserService.prototype.removePlaylist = function (id, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var userPlaylists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.removePlaylist(id, doc)];
                    case 1:
                        userPlaylists = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(userPlaylists)];
                }
            });
        });
    };
    UserService.prototype.subscribeEvents = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var event, data, userId, playlist, library, type;
            return __generator(this, function (_a) {
                console.log("Triggering... User Events");
                payload = JSON.parse(payload);
                event = payload.event, data = payload.data;
                if (!event || !data)
                    return [2 /*return*/];
                userId = data.userId, playlist = data.playlist, library = data.library, type = data.type;
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
                return [2 /*return*/];
            });
        });
    };
    return UserService;
}());
exports.default = UserService;
