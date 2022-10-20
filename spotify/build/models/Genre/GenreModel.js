"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//TODO Remove model
const GenreSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
    },
}, { timestamps: true });
const GenreModel = (0, mongoose_1.model)("Genre", GenreSchema);
exports.default = GenreModel;
