"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = __importDefault(require("../config/config"));
var MONGO_ATLAS_URI = config_1.default.db.url || "";
function connect() {
    return mongoose_1.default.connect(MONGO_ATLAS_URI);
}
exports.default = connect;
