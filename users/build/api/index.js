"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = exports.user = void 0;
var user_router_1 = __importDefault(require("./router/user.router"));
exports.user = user_router_1.default;
var chat_router_1 = __importDefault(require("./router/chat.router"));
exports.chat = chat_router_1.default;
