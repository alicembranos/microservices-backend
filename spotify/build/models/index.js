"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArtistModel_1 = __importDefault(require("./Artist/ArtistModel"));
const AlbumModel_1 = __importDefault(require("./Album/AlbumModel"));
const TrackModel_1 = __importDefault(require("./Track/TrackModel"));
const PlaylistModel_1 = __importDefault(require("./Playlist/PlaylistModel"));
exports.default = {
    Artist: ArtistModel_1.default,
    Album: AlbumModel_1.default,
    Track: TrackModel_1.default,
    Playlist: PlaylistModel_1.default,
};
