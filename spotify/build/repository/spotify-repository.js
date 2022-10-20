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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
//Dealing with data base operations
class Spotify {
    createDocument(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.create(data);
        });
    }
    getAllDocuments(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const populateField = (0, index_1.selectFieldsToPopulate)(model);
            return yield model.find().populate(populateField).lean().exec();
        });
    }
    getDocumentById(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const populateField = (0, index_1.selectFieldsToPopulate)(model);
            return yield model.findById(id).populate(populateField).lean().exec();
        });
    }
    getDocumentByFilter(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const arrayData = Object.values(data).flat();
            const populateField = (0, index_1.selectFieldsToPopulate)(model);
            return yield model
                .find({ genres: { $in: arrayData } })
                .populate(populateField)
                .lean()
                .exec();
        });
    }
    updateDocument(model, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = id;
            const populateField = (0, index_1.selectFieldsToPopulate)(model);
            return yield model
                .findOneAndUpdate({ _id }, Object.assign({}, data), { new: true })
                .populate(populateField)
                .lean()
                .exec();
        });
    }
    updateArrayInDocument(model, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const populateField = (0, index_1.selectFieldsToPopulate)(model);
            return yield model
                .findByIdAndUpdate(id, { $push: Object.assign({}, data) }, { new: true })
                .populate(populateField)
                .lean()
                .exec();
        });
    }
    deleteDocument(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findByIdAndDelete(id);
        });
    }
}
exports.default = Spotify;
