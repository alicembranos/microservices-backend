"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cloudinary_1 = __importDefault(require("cloudinary"));
var cloudinaryAuth = cloudinary_1.default.v2;
cloudinaryAuth.config({
    cloud_name: 'juancarlos',
    api_key: '741934352396129',
    api_secret: 'zJh5VEmeEJEtdsLeuaL5_BrMvj4'
});
exports.default = cloudinaryAuth;
