"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        //TODO: Username must be unique, check it at signup process
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: "",
    },
    image: {
        type: String,
    },
    genres: [
        {
            type: String,
            default: [],
        },
    ],
    playlists: [
        {
            _id: { type: mongoose_1.SchemaTypes.ObjectId, require: true },
            title: { type: String },
            description: { type: String },
            image: { type: String },
        },
    ],
    artists: [
        {
            _id: { type: String, require: true },
            image: { type: String },
            name: { type: String },
        },
    ],
    albums: [
        {
            _id: { type: String, require: true },
            image: { type: String },
            title: { type: String },
            //! Do I need take every fields?
            artist: { _id: { type: String }, name: { type: String } },
        },
    ],
    likedSongs: [
        {
            _id: { type: String, require: true },
            title: { type: String },
            description: { type: String },
            image: { type: String },
            trackAudio: { type: String },
            //! Do I need take every fields?
            album: { _id: { type: String }, title: { type: String } },
        },
    ],
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            delete ret.password;
            delete ret.__v;
        },
    },
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
