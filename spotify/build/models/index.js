"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ArtistModel_1 = __importDefault(require("./Artist/ArtistModel"));
var AlbumModel_1 = __importDefault(require("./Album/AlbumModel"));
var TrackModel_1 = __importDefault(require("./Track/TrackModel"));
var PlaylistModel_1 = __importDefault(require("./Playlist/PlaylistModel"));
var GenreModel_1 = __importDefault(require("./Genre/GenreModel"));
exports.default = {
    Artist: ArtistModel_1.default,
    Album: AlbumModel_1.default,
    Track: TrackModel_1.default,
    Playlist: PlaylistModel_1.default,
    Genre: GenreModel_1.default,
};
