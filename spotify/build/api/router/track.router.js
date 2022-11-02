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
const index_2 = require("../../utils/index");
const config_1 = __importDefault(require("../../config/config"));
const cloudinary_1 = require("../../utils/cloudinary/cloudinary");
const uuid_1 = require("uuid");
exports.default = (app, channel) => {
    const service = new spotify_service_1.default();
    app.get("/track", (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.getAll(index_1.default.Track);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.post("/track", auth_middleware_1.default, ({ body }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { title, trackAudio } = body;
            if (!title || !trackAudio)
                return res.status(400).json({ ok: false, msg: "All fields are required" });
            const result = yield (0, cloudinary_1.uploadTrack)(trackAudio);
            trackAudio = result === null || result === void 0 ? void 0 : result.secure_url;
            const _id = (0, uuid_1.v4)();
            const duration = result === null || result === void 0 ? void 0 : result.duration;
            const trackNumber = Math.floor(Math.random() * (16 - 1) + 1);
            const album = undefined; //default
            const data = yield service.create(index_1.default.Track, {
                _id,
                title,
                trackAudio,
                duration,
                trackNumber,
                album,
            });
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.get("/track/:id", ({ params: { id } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.get(index_1.default.Track, id);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.put("/track/library", auth_middleware_1.default, ({ user: { sub }, body: { _id } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.getLibraryPayload(sub, index_1.default.Track, _id, "ADD_TO_LIBRARY", "likedSongs");
            (0, index_2.publishMessage)(channel, config_1.default.app.USER_SERVICE, JSON.stringify(data));
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
};
