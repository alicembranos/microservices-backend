"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TrackSchema = new mongoose_1.Schema({
    _id: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    trackNumber: {
        type: Number,
        required: true,
    },
    trackAudio: {
        type: String,
        // required: true,
    },
    album: {
        type: mongoose_1.Schema.Types.String,
        ref: "Album",
    },
}, { timestamps: true });
const TrackModel = (0, mongoose_1.model)("Track", TrackSchema);
exports.default = TrackModel;
