"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.playlists = exports.tracks = exports.albums = exports.artists = void 0;
var artist_router_1 = __importDefault(require("./router/artist.router"));
exports.artists = artist_router_1.default;
var album_router_1 = __importDefault(require("./router/album.router"));
exports.albums = album_router_1.default;
var track_router_1 = __importDefault(require("./router/track.router"));
exports.tracks = track_router_1.default;
var playlist_router_1 = __importDefault(require("./router/playlist.router"));
exports.playlists = playlist_router_1.default;
var search_router_1 = __importDefault(require("./router/search.router"));
exports.search = search_router_1.default;
