"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ArtistSchema = new mongoose_1.Schema({
    _id: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    followers: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    popularity: {
        type: Number,
        required: true,
    },
    genres: [
        {
            type: String,
        },
    ],
    tracks: [
        {
            type: mongoose_1.Schema.Types.String,
            ref: "Track",
            default: [],
        },
    ],
    albums: [
        {
            type: mongoose_1.Schema.Types.String,
            ref: "Album",
            default: [],
        },
    ],
}, {
    timestamps: true,
    toObject: { virtuals: true },
});
var ArtistModel = (0, mongoose_1.model)("Artist", ArtistSchema);
exports.default = ArtistModel;
