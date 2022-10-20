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
var spotify_service_1 = __importDefault(require("../../services/spotify-service"));
var index_1 = __importDefault(require("../../models/index"));
var auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
var utils_1 = require("../../utils");
var config_1 = __importDefault(require("../../config/config"));
var cloudinary_1 = __importDefault(require("../../utils/cloudinary/cloudinary"));
exports.default = (function (app, channel) {
    var service = new spotify_service_1.default();
    app.get("/playlist", auth_middleware_1.default, function (_req, res, _next) { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, service.getAll(index_1.default.Playlist)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                case 2:
                    error_1 = _a.sent();
                    res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error_1) });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/playlist/:id", auth_middleware_1.default, function (_a, res, _next) {
        var id = _a.params.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, service.get(index_1.default.Playlist, id)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 2:
                        error_2 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error_2) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
    app.post("/playlist", auth_middleware_1.default, function (_a, res, _next) {
        var userId = _a.user.sub, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var bodyWithUserId, secure_url, data, payload, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        bodyWithUserId = __assign(__assign({}, body), { userId: userId });
                        return [4 /*yield*/, cloudinary_1.default.uploader.upload("data:image/png;base64,".concat(body.image), {
                                upload_preset: "photos",
                            }, function (_error, result) {
                                return result;
                            })];
                    case 1:
                        secure_url = (_b.sent()).secure_url;
                        bodyWithUserId.image = secure_url;
                        return [4 /*yield*/, service.create(index_1.default.Playlist, bodyWithUserId)];
                    case 2:
                        data = _b.sent();
                        return [4 /*yield*/, service.getPlaylistPayload(userId, index_1.default.Playlist, data._id, "ADD_TO_PLAYLIST")];
                    case 3:
                        payload = _b.sent();
                        (0, utils_1.publishMessage)(channel, config_1.default.app.USER_SERVICE, JSON.stringify(payload));
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 4:
                        error_3 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error_3) });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    });
    app.patch("/playlist/tracks/:id", auth_middleware_1.default, function (_a, res, _next) {
        var id = _a.params.id, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, service.updateFromArray(index_1.default.Playlist, id, body)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 2:
                        error_4 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error_4) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
    app.delete("/playlist/tracks/:id", auth_middleware_1.default, function (_a, res, _next) {
        var id = _a.params.id, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, service.deleteFromArray(index_1.default.Playlist, id, body)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 2:
                        error_5 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error_5) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
    app.patch("/playlist/:id", auth_middleware_1.default, function (_a, res, _next) {
        var id = _a.params.id, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var secure_url, data, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!!body.image.includes("res.cloudinary.com")) return [3 /*break*/, 2];
                        return [4 /*yield*/, cloudinary_1.default.uploader.upload("data:image/png;base64,".concat(body.image), {
                                upload_preset: "photos",
                            }, function (_error, result) {
                                if (_error)
                                    throw new Error("Cloudinary Error");
                                return result;
                            })];
                    case 1:
                        secure_url = (_b.sent()).secure_url;
                        body.image = secure_url;
                        _b.label = 2;
                    case 2: return [4 /*yield*/, service.update(index_1.default.Playlist, id, body)];
                    case 3:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 4:
                        error_6 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error_6) });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    });
    app.delete("/playlist/:id", auth_middleware_1.default, function (_a, res, _next) {
        var id = _a.params.id, userId = _a.user.sub;
        return __awaiter(void 0, void 0, void 0, function () {
            var payload, data, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, service.getPlaylistPayload(userId, index_1.default.Playlist, id, "REMOVE_FROM_PLAYLIST")];
                    case 1:
                        payload = _b.sent();
                        (0, utils_1.publishMessage)(channel, config_1.default.app.USER_SERVICE, JSON.stringify(payload));
                        return [4 /*yield*/, service.delete(index_1.default.Playlist, id)];
                    case 2:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 3:
                        error_7 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error_7) });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
});
