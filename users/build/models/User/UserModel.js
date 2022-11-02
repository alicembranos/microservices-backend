"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
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
            duration: { type: Number },
            album: { _id: { type: String }, title: { type: String } },
        },
    ],
    chats: [
        {
            toUser: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
            current: { type: Boolean },
            pendingMessages: {
                type: Number,
                default: 0,
            },
            messages: [
                {
                    type: String,
                    default: [],
                },
            ],
        },
        { default: [] },
    ],
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            delete ret.password;
        },
    },
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
