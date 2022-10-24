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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
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
    User.prototype.addDocumentToFavorites = function (userId, doc, propDocument) {
        return __awaiter(this, void 0, void 0, function () {
            var inLibrary;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, index_1.default.User.findById(userId, (_a = {},
                            _a[propDocument] = { $elemMatch: { _id: doc._id } },
                            _a))];
                    case 1:
                        inLibrary = _d.sent();
                        console.log(inLibrary, "******************");
                        if (!inLibrary) {
                            return [2 /*return*/, undefined];
                        }
                        if (!inLibrary) return [3 /*break*/, 5];
                        if (!(inLibrary[propDocument].length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, index_1.default.User.findByIdAndUpdate(userId, { $pull: (_b = {}, _b[propDocument] = { _id: doc._id }, _b) }, { new: true, multi: false })];
                    case 2: return [2 /*return*/, _d.sent()];
                    case 3:
                        if (!(inLibrary[propDocument].length === 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, index_1.default.User.findByIdAndUpdate(userId, { $push: (_c = {}, _c[propDocument] = doc, _c) }, { new: true })];
                    case 4: return [2 /*return*/, _d.sent()];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.addPlaylist = function (userId, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, index_1.default.User.findByIdAndUpdate(userId, { $push: { playlists: doc } }, { new: true })];
                    case 1:
                        profile = _a.sent();
                        if (profile)
                            return [2 /*return*/, profile.playlists];
                        return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.removePlaylist = function (userId, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var objectId, profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        objectId = new mongoose_1.Types.ObjectId(doc._id);
                        return [4 /*yield*/, index_1.default.User.findByIdAndUpdate(userId, { $pull: { playlists: { _id: objectId } } }, { new: true, multi: false })];
                    case 1:
                        profile = _a.sent();
                        if (profile)
                            return [2 /*return*/, profile.playlists];
                        return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.updatePlaylist = function (userId, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var objectId, profile;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        objectId = new mongoose_1.Types.ObjectId(doc._id);
                        return [4 /*yield*/, index_1.default.User.findByIdAndUpdate(userId, { $set: (_a = {}, _a["playlists.$[item]"] = doc, _a) }, { arrayFilters: [{ "item._id": objectId }] })];
                    case 1:
                        profile = _b.sent();
                        if (profile)
                            return [2 /*return*/, profile.playlists];
                        return [2 /*return*/];
                }
            });
        });
    };
    return User;
}());
exports.default = User;
