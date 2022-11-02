"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentation = exports.search = exports.playlists = exports.tracks = exports.albums = exports.artists = void 0;
const artist_router_1 = __importDefault(require("./router/artist.router"));
exports.artists = artist_router_1.default;
const album_router_1 = __importDefault(require("./router/album.router"));
exports.albums = album_router_1.default;
const track_router_1 = __importDefault(require("./router/track.router"));
exports.tracks = track_router_1.default;
const playlist_router_1 = __importDefault(require("./router/playlist.router"));
exports.playlists = playlist_router_1.default;
const search_router_1 = __importDefault(require("./router/search.router"));
exports.search = search_router_1.default;
const doc_router_1 = __importDefault(require("./router/doc.router"));
exports.documentation = doc_router_1.default;
