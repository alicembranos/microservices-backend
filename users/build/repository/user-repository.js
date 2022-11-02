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
const mongoose_1 = require("mongoose");
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
            return yield model.find();
        });
    }
    getDocumentById(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findById(id);
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
            return yield model.findOneAndUpdate({ _id }, Object.assign({}, data), { new: true });
        });
    }
    updateDocumentById(model, id, data, property) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield model.findByIdAndUpdate(id, { $set: { [property]: data } }, { new: true });
            if (profile)
                return profile[property];
        });
    }
    deleteDocument(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findByIdAndDelete(id);
        });
    }
    addDocumentToFavorites(userId, doc, propDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            const inLibrary = yield index_1.default.User.findById(userId, {
                [propDocument]: { $elemMatch: { _id: doc._id } },
            });
            if (!inLibrary) {
                return undefined;
            }
            if (inLibrary) {
                if (inLibrary[propDocument].length > 0) {
                    return yield index_1.default.User.findByIdAndUpdate(userId, { $pull: { [propDocument]: { _id: doc._id } } }, { new: true, multi: false });
                }
                if (inLibrary[propDocument].length === 0) {
                    return yield index_1.default.User.findByIdAndUpdate(userId, { $push: { [propDocument]: doc } }, { new: true });
                }
            }
        });
    }
    addPlaylist(userId, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield index_1.default.User.findByIdAndUpdate(userId, { $push: { playlists: doc } }, { new: true });
            if (profile)
                return profile.playlists;
        });
    }
    removePlaylist(userId, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.Types.ObjectId(doc._id);
            const profile = yield index_1.default.User.findByIdAndUpdate(userId, { $pull: { playlists: { _id: objectId } } }, { new: true, multi: false });
            if (profile)
                return profile.playlists;
        });
    }
    updatePlaylist(userId, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.Types.ObjectId(doc._id);
            const profile = yield index_1.default.User.findByIdAndUpdate(userId, { $set: { [`playlists.$[item]`]: doc } }, { arrayFilters: [{ "item._id": objectId }] });
            if (profile)
                return profile.playlists;
        });
    }
    addChat(model, userId, doc, property) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield model.findByIdAndUpdate(userId, { $push: { [property]: doc } }, { new: true });
            if (profile)
                return profile[property];
        });
    }
    addMessageToChat(model, userId, doc, toUserId, property) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield model.findByIdAndUpdate(userId, { $push: { [`chats.$[outer].${property}`]: doc } }, { arrayFilters: [{ "outer.toUser": toUserId }], new: true });
            if (profile)
                return profile.chats;
        });
    }
    updateNestedObjectInArrayNotEqual(model, userId, value, toUserId, propertyA, propertyB) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield model.findByIdAndUpdate(userId, { $set: { [`${propertyA}.$[outer].${propertyB}`]: value } }, { arrayFilters: [{ "outer.toUser": { $ne: toUserId } }], new: true });
            if (profile)
                return profile[propertyA];
        });
    }
    updateNestedObjectInArrayBoolean(model, userId, value, toUserId, propertyA, propertyB) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield model.findByIdAndUpdate(userId, { $set: { [`${propertyA}.$[outer].${propertyB}`]: value } }, { arrayFilters: [{ "outer.toUser": toUserId }], new: true });
            if (profile)
                return profile[propertyA];
        });
    }
    updateNestedObjectInArray(model, userId, toUserId, propertyA, propertyB) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield model.findByIdAndUpdate(userId, { $inc: { [`${propertyA}.$[outer].${propertyB}`]: 1 } }, { arrayFilters: [{ "outer.toUser": toUserId }], new: true });
            if (profile)
                return profile[propertyA];
        });
    }
}
exports.default = User;
