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
const user_repository_1 = __importDefault(require("../repository/user-repository"));
const index_1 = require("../utils/index");
const index_2 = __importDefault(require("../models/index"));
//User Business logic
class UserService {
    constructor() {
        this.repository = new user_repository_1.default();
    }
    signIn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const user = yield this.repository.getDocumentByField(index_2.default.User, { email });
            if (!user)
                throw new Error("User does not exist. Please sign up.");
            console.log("ValidatePassword ", password, '-----', user.password);
            const validPassword = yield (0, index_1.validatePassword)(password, user.password);
            console.log(validPassword);
            if (!validPassword)
                throw new Error("Invalid credentials");
            console.log("aqui llego");
            const token = yield (0, index_1.generateSignature)({ sub: user._id, username: user.username });
            const refreshToken = yield (0, index_1.generateRefreshSignature)({ sub: user._id, username: user.username });
            return (0, index_1.formateData)({ token, refreshToken, username: user.username, id: user._id });
        });
    }
    signUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, username, genres } = data;
            if (!email || !password || !username)
                throw new Error("Invalid credentials");
            //Check if user exist by email
            const user = yield this.repository.getDocumentByField(index_2.default.User, { email });
            if (user)
                throw new Error("User already exists");
            //Check if user exist by username
            const usernameExist = yield this.repository.getDocumentByField(index_2.default.User, { username });
            if (usernameExist)
                throw new Error("Username is already used. Please select a new one.");
            const hashPassword = yield (0, index_1.generatePassword)(password);
            console.log('Generated Passord ::::::/', hashPassword);
            const newUser = yield this.repository.createDocument(index_2.default.User, {
                email,
                password: hashPassword,
                username,
                genres,
            });
            const token = yield (0, index_1.generateSignature)({ sub: newUser._id, username });
            const refreshToken = yield (0, index_1.generateRefreshSignature)({ sub: newUser._id, username });
            return (0, index_1.formateData)({ token, refreshToken, username: newUser.username });
        });
    }
    refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                throw new Error("Unauthorized.");
            try {
                const { sub, username } = yield (0, index_1.validateRefreshSignature)(token);
                const newToken = yield (0, index_1.generateSignature)({ sub, username });
                return (0, index_1.formateData)(newToken);
            }
            catch (error) {
                (0, index_1.handleError)(error);
            }
        });
    }
    logout(token, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                throw new Error("Unauthorized.");
            try {
                const { sub } = yield (0, index_1.validateRefreshSignature)(refreshToken);
                yield (0, index_1.deleteUserCacheToken)(sub);
                yield (0, index_1.addTokenToBlacklist)(token);
                return (0, index_1.formateData)("Sucesfully logout");
            }
            catch (error) {
                (0, index_1.handleError)(error);
            }
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
    update(model, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.updateDocument(model, id, data);
            return (0, index_1.formateData)(documentResult);
        });
    }
    delete(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentResult = yield this.repository.deleteDocument(model, id);
            return (0, index_1.formateData)(documentResult);
        });
    }
    addToLibrary(id, doc, propDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            const libraryResult = yield this.repository.addDocumentToFavorites(id, doc, propDocument);
            return (0, index_1.formateData)(libraryResult);
        });
    }
    addPlaylist(id, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPlaylists = yield this.repository.addPlaylist(id, doc);
            return (0, index_1.formateData)(userPlaylists);
        });
    }
    removePlaylist(id, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPlaylists = yield this.repository.removePlaylist(id, doc);
            return (0, index_1.formateData)(userPlaylists);
        });
    }
    subscribeEvents(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Triggering... User Events");
            payload = JSON.parse(payload);
            const { event, data } = payload;
            if (!event || !data)
                return;
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
        });
    }
}
exports.default = UserService;
