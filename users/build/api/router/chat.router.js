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
const chat_service_1 = __importDefault(require("../../services/chat-service"));
const index_1 = __importDefault(require("../../models/index"));
const index_2 = require("../../utils/index");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
exports.default = (app) => {
    const chatService = new chat_service_1.default();
    app.post("/chat/messages", auth_middleware_1.default, ({ user: { sub: userId }, body }, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { toUser, messages, users } = body;
        try {
            const data = yield chatService.updateMessages(index_1.default.User, userId, { toUser, messages });
            const result = yield chatService.updatePendingMessages(index_1.default.User, userId, toUser, users);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.post("/chat/getMessages", auth_middleware_1.default, ({ user: { sub: userId }, body }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        const { toUserId } = body;
        try {
            const data = yield chatService.getMessages(index_1.default.User, userId, toUserId);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.post("/chat/currentRoom", auth_middleware_1.default, ({ user: { sub: userId } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield chatService.getCurrentRoom(index_1.default.User, userId);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.post("/chat/pendingMessages", auth_middleware_1.default, ({ user: { sub: userId } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield chatService.getPendingMessages(index_1.default.User, userId);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.post("/chat/deletePendingMessages", auth_middleware_1.default, ({ user: { sub: userId }, body: { toUserId } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield chatService.deletePendingMessages(index_1.default.User, userId, toUserId);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
};
