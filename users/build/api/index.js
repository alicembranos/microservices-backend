"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentation = exports.chat = exports.user = void 0;
const user_router_1 = __importDefault(require("./router/user.router"));
exports.user = user_router_1.default;
const chat_router_1 = __importDefault(require("./router/chat.router"));
exports.chat = chat_router_1.default;
const doc_router_1 = __importDefault(require("./router/doc.router"));
exports.documentation = doc_router_1.default;
