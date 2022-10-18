"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AlbumSchema = new mongoose_1.Schema({
    _id: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    totalTracks: {
        type: Number,
        required: true,
    },
    tracks: [
        {
            type: mongoose_1.Schema.Types.String,
            ref: "Track",
            default: [],
        },
    ],
    artist: {
        type: mongoose_1.Schema.Types.String,
        ref: "Artist",
    },
}, { timestamps: true });
const AlbumModel = (0, mongoose_1.model)("Album", AlbumSchema);
exports.default = AlbumModel;
