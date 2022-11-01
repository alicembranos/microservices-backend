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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chat_service_1 = __importDefault(require("../../services/chat-service"));
var index_1 = __importDefault(require("../../models/index"));
var index_2 = require("../../utils/index");
var auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
exports.default = (function (app) {
    var chatService = new chat_service_1.default();
    app.post("/chat/messages", auth_middleware_1.default, function (_a, res) {
        var userId = _a.user.sub, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var toUser, messages, users, data, result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        toUser = body.toUser, messages = body.messages, users = body.users;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, chatService.updateMessages(index_1.default.User, userId, { toUser: toUser, messages: messages })];
                    case 2:
                        data = _b.sent();
                        return [4 /*yield*/, chatService.updatePendingMessages(index_1.default.User, userId, toUser, users)];
                    case 3:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 4:
                        error_1 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error_1) });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    });
    app.post("/chat/getMessages", auth_middleware_1.default, function (_a, res, _next) {
        var userId = _a.user.sub, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var toUserId, data, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        toUserId = body.toUserId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, chatService.getMessages(index_1.default.User, userId, toUserId)];
                    case 2:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 3:
                        error_2 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error_2) });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
    app.post("/chat/currentRoom", auth_middleware_1.default, function (_a, res, _next) {
        var userId = _a.user.sub;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, chatService.getCurrentRoom(index_1.default.User, userId)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 2:
                        error_3 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error_3) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
    app.post("/chat/pendingMessages", auth_middleware_1.default, function (_a, res, _next) {
        var userId = _a.user.sub;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, chatService.getPendingMessages(index_1.default.User, userId)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 2:
                        error_4 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error_4) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
    app.post("/chat/deletePendingMessages", auth_middleware_1.default, function (_a, res, _next) {
        var userId = _a.user.sub, toUserId = _a.body.toUserId;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, chatService.deletePendingMessages(index_1.default.User, userId, toUserId)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({ ok: true, data: data })];
                    case 2:
                        error_5 = _b.sent();
                        res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error_5) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
});
