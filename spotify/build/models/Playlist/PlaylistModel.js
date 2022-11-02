"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PlaylistSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        unique: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    tracks: [
        {
            type: mongoose_1.Schema.Types.String,
            ref: "Track",
            default: [],
        },
    ],
    userId: {
        type: String,
        required: true,
    },
}, { timestamps: true } //*get year of the playlist with createdAt field
);
const PlaylistModel = (0, mongoose_1.model)("Playlist", PlaylistSchema);
exports.default = PlaylistModel;
