"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TrackSchema = new mongoose_1.Schema({
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
var TrackModel = (0, mongoose_1.model)("Track", TrackSchema);
exports.default = TrackModel;
