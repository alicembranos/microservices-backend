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
var user_repository_1 = __importDefault(require("../repository/user-repository"));
var index_1 = require("../utils/index");
//Chat Business logic
var ChatService = /** @class */ (function () {
    function ChatService() {
        this.repository = new user_repository_1.default();
    }
    ChatService.prototype.updatePendingMessages = function (model, fromUserId, toUserId, users) {
        return __awaiter(this, void 0, void 0, function () {
            var isConnected, toUser, updateToUserChats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isConnected = users.find(function (user) { return user.id == toUserId; });
                        if (!(isConnected === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.repository.getDocumentById(model, toUserId)];
                    case 1:
                        toUser = _a.sent();
                        if (!toUser)
                            throw new Error("Receiver User does not exist");
                        return [4 /*yield*/, this.repository.updateNestedObjectInArray(model, toUserId, fromUserId, "chats", "pendingMessages")];
                    case 2:
                        updateToUserChats = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(updateToUserChats)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.updateMessages = function (model, fromUserId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var toUser, messages, fromUser, updatedChatsSender, updatedChatsReceiver, chatSenderUser, chats, devuelvesTrue, toUserReceiver, chatReceiverUser, chats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toUser = data.toUser, messages = data.messages;
                        if (!toUser || !messages)
                            throw new Error("Request body data missed");
                        return [4 /*yield*/, this.repository.getDocumentById(model, fromUserId)];
                    case 1:
                        fromUser = _a.sent();
                        if (!fromUser)
                            throw new Error("Sender User does not exist");
                        chatSenderUser = fromUser === null || fromUser === void 0 ? void 0 : fromUser.chats.find(function (chat) { return chat.toUser == toUser; });
                        if (!(chatSenderUser === undefined)) return [3 /*break*/, 3];
                        chats = { toUser: toUser, messages: messages, current: true, pendingMessages: 0 };
                        return [4 /*yield*/, this.repository.addChat(model, fromUserId, chats, "chats")];
                    case 2:
                        updatedChatsSender = _a.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.repository.addMessageToChat(model, fromUserId, messages, toUser, "messages")];
                    case 4:
                        updatedChatsSender = _a.sent();
                        return [4 /*yield*/, this.repository.updateNestedObjectInArrayBoolean(model, fromUserId, true, toUser, "chats", "current")];
                    case 5:
                        devuelvesTrue = _a.sent();
                        console.log(devuelvesTrue, "*********************");
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.repository.updateNestedObjectInArrayNotEqual(model, fromUserId, false, toUser, "chats", "current")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.repository.getDocumentById(model, toUser)];
                    case 8:
                        toUserReceiver = _a.sent();
                        if (!toUserReceiver)
                            throw new Error("Receiver User does not exist");
                        chatReceiverUser = toUserReceiver === null || toUserReceiver === void 0 ? void 0 : toUserReceiver.chats.find(function (chat) { return chat.toUser == fromUserId; });
                        console.log("chat receiver********", chatReceiverUser);
                        if (!(chatReceiverUser === undefined)) return [3 /*break*/, 10];
                        chats = { toUser: fromUserId, messages: messages, current: false, pendingMessages: 0 };
                        return [4 /*yield*/, this.repository.addChat(model, toUser, chats, "chats")];
                    case 9:
                        updatedChatsReceiver = _a.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.repository.addMessageToChat(model, toUser, messages, fromUserId, "messages")];
                    case 11:
                        updatedChatsReceiver = _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, (0, index_1.formateData)({ updatedChatsSender: updatedChatsSender, updatedChatsReceiver: updatedChatsReceiver })];
                }
            });
        });
    };
    ChatService.prototype.getMessages = function (model, fromUserId, toUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var fromUser, chatMessages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getDocumentById(model, fromUserId)];
                    case 1:
                        fromUser = _a.sent();
                        if (!fromUser)
                            throw new Error("User Request does not exist");
                        chatMessages = fromUser.chats.find(function (chat) { return chat.toUser == toUserId; });
                        return [2 /*return*/, (0, index_1.formateData)(chatMessages === null || chatMessages === void 0 ? void 0 : chatMessages.messages)];
                }
            });
        });
    };
    ChatService.prototype.getCurrentRoom = function (model, fromUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var fromUser, room, toCurrentUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getDocumentById(model, fromUserId)];
                    case 1:
                        fromUser = _a.sent();
                        if (!fromUser)
                            throw new Error("User Request does not exist");
                        room = fromUser.chats.find(function (chat) { return chat.current === true; });
                        if (!room)
                            throw new Error("No current chat");
                        return [4 /*yield*/, this.repository.getDocumentById(model, room.toUser)];
                    case 2:
                        toCurrentUser = _a.sent();
                        if (!toCurrentUser)
                            throw new Error("Contact does not exist in the database");
                        return [2 /*return*/, (0, index_1.formateData)(toCurrentUser)];
                }
            });
        });
    };
    ChatService.prototype.getPendingMessages = function (model, fromUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var fromUser, fromUserChats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getDocumentById(model, fromUserId)];
                    case 1:
                        fromUser = _a.sent();
                        if (!fromUser)
                            throw new Error("User Request does not exist");
                        fromUserChats = fromUser.chats;
                        return [2 /*return*/, (0, index_1.formateData)(fromUserChats)];
                }
            });
        });
    };
    ChatService.prototype.deletePendingMessages = function (model, fromUserId, toUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var fromUser, chat, updatedChats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getDocumentById(model, fromUserId)];
                    case 1:
                        fromUser = _a.sent();
                        if (!fromUser)
                            throw new Error("User Request does not exist");
                        chat = fromUser === null || fromUser === void 0 ? void 0 : fromUser.chats.find(function (chat) { return chat.toUser == toUserId; });
                        if (!(chat !== undefined)) return [3 /*break*/, 3];
                        fromUser === null || fromUser === void 0 ? void 0 : fromUser.chats.map(function (chat) {
                            if (chat.toUser == toUserId) {
                                chat.pendingMessages = 0;
                            }
                        });
                        return [4 /*yield*/, this.repository.updateDocumentById(model, fromUserId, fromUser === null || fromUser === void 0 ? void 0 : fromUser.chats, "chats")];
                    case 2:
                        updatedChats = _a.sent();
                        return [2 /*return*/, (0, index_1.formateData)(updatedChats)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ChatService;
}());
exports.default = ChatService;
