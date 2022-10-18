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
const spotify_service_1 = __importDefault(require("../../services/spotify-service"));
const index_1 = __importDefault(require("../../models/index"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const utils_1 = require("../../utils");
const config_1 = __importDefault(require("../../config/config"));
exports.default = (app, channel) => {
    const service = new spotify_service_1.default();
    app.get("/playlist", auth_middleware_1.default, (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.getAll(index_1.default.Playlist);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error) });
        }
    }));
    app.get("/playlist/:id", auth_middleware_1.default, ({ params: { id } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.get(index_1.default.Playlist, id);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error) });
        }
    }));
    app.post("/playlist", auth_middleware_1.default, ({ user: { sub: userId }, body }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bodyWithUserId = Object.assign(Object.assign({}, body), { userId });
            const data = yield service.create(index_1.default.Playlist, bodyWithUserId);
            const payload = yield service.getPlaylistPayload(userId, index_1.default.Playlist, data._id, "ADD_TO_PLAYLIST");
            (0, utils_1.publishMessage)(channel, config_1.default.app.USER_SERVICE, JSON.stringify(payload));
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error) });
        }
    }));
    //! not allow to modify title, image or description from the front
    app.patch("/playlist/:id", auth_middleware_1.default, ({ params: { id }, body }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.updateArray(index_1.default.Playlist, id, body);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error) });
        }
    }));
    app.delete("/playlist/:id", auth_middleware_1.default, ({ params: { id }, user: { sub: userId } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = yield service.getPlaylistPayload(userId, index_1.default.Playlist, id, "REMOVE_FROM_PLAYLIST");
            (0, utils_1.publishMessage)(channel, config_1.default.app.USER_SERVICE, JSON.stringify(payload));
            const data = yield service.delete(index_1.default.Playlist, id);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error) });
        }
    }));
};
