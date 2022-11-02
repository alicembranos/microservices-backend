"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTrack = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinaryAuth = cloudinary_1.default.v2;
cloudinaryAuth.config({
    cloud_name: "juancarlos",
    api_key: "741934352396129",
    api_secret: "zJh5VEmeEJEtdsLeuaL5_BrMvj4",
});
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinaryAuth.uploader.upload(`data:image/png;base64,${file}`, {
            upload_preset: "photos",
        }, (error, result) => {
            if (error) {
                console.log("error", error);
                return reject(new Error("Failed to upload file"));
            }
            resolve(result === null || result === void 0 ? void 0 : result.secure_url);
        });
    });
});
exports.uploadImage = uploadImage;
const uploadTrack = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinaryAuth.uploader.upload(`data:image/png;base64,${file}`, { resource_type: "video", folder: "audiofiles/", overwrite: true }, (error, result) => {
            if (error) {
                console.log("error", error);
                return reject(new Error("Failed to upload file"));
            }
            resolve(result);
        });
    });
});
exports.uploadTrack = uploadTrack;
