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
const utils_1 = require("../../utils");
exports.default = (app) => {
    const service = new spotify_service_1.default();
    app.get("/search/:param", ({ params: { param } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const albums = yield service.search(index_1.default.Album, param);
            const artists = yield service.search(index_1.default.Artist, param);
            const tracks = yield service.search(index_1.default.Track, param);
            const playlists = yield service.search(index_1.default.Playlist, param);
            return res.status(200).json({ ok: true, data: { albums, artists, tracks, playlists } });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, utils_1.handleError)(error) });
        }
    }));
};
