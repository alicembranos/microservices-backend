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
const user_repository_1 = __importDefault(require("../repository/user-repository"));
const index_1 = require("../utils/index");
//Chat Business logic
class ChatService {
    constructor() {
        this.repository = new user_repository_1.default();
    }
    updatePendingMessages(model, fromUserId, toUserId, users) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = users.find((user) => user.id == toUserId);
            if (isConnected === undefined) {
                //Update Receiver User
                const toUser = yield this.repository.getDocumentById(model, toUserId);
                if (!toUser)
                    throw new Error("Receiver User does not exist");
                const updateToUserChats = yield this.repository.updateNestedObjectInArray(model, toUserId, fromUserId, "chats", "pendingMessages");
                return (0, index_1.formateData)(updateToUserChats);
            }
        });
    }
    updateMessages(model, fromUserId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { toUser, messages } = data;
            if (!toUser || !messages)
                throw new Error("Request body data missed");
            //Update Sender User
            const fromUser = yield this.repository.getDocumentById(model, fromUserId);
            if (!fromUser)
                throw new Error("Sender User does not exist");
            let updatedChatsSender;
            let updatedChatsReceiver;
            const chatSenderUser = fromUser === null || fromUser === void 0 ? void 0 : fromUser.chats.find((chat) => chat.toUser == toUser);
            if (chatSenderUser === undefined) {
                const chats = { toUser, messages, current: true, pendingMessages: 0 };
                updatedChatsSender = yield this.repository.addChat(model, fromUserId, chats, "chats");
            }
            else {
                updatedChatsSender = yield this.repository.addMessageToChat(model, fromUserId, messages, toUser, "messages");
                const devuelvesTrue = yield this.repository.updateNestedObjectInArrayBoolean(model, fromUserId, true, toUser, "chats", "current");
            }
            yield this.repository.updateNestedObjectInArrayNotEqual(model, fromUserId, false, toUser, "chats", "current");
            const toUserReceiver = yield this.repository.getDocumentById(model, toUser);
            if (!toUserReceiver)
                throw new Error("Receiver User does not exist");
            //Update Receiver Use
            const chatReceiverUser = toUserReceiver === null || toUserReceiver === void 0 ? void 0 : toUserReceiver.chats.find((chat) => chat.toUser == fromUserId);
            if (chatReceiverUser === undefined) {
                const chats = { toUser: fromUserId, messages, current: false, pendingMessages: 0 };
                updatedChatsReceiver = yield this.repository.addChat(model, toUser, chats, "chats");
            }
            else {
                updatedChatsReceiver = yield this.repository.addMessageToChat(model, toUser, messages, fromUserId, "messages");
            }
            return (0, index_1.formateData)({ updatedChatsSender, updatedChatsReceiver });
        });
    }
    getMessages(model, fromUserId, toUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromUser = yield this.repository.getDocumentById(model, fromUserId);
            if (!fromUser)
                throw new Error("User Request does not exist");
            const chatMessages = fromUser.chats.find((chat) => chat.toUser == toUserId);
            return (0, index_1.formateData)(chatMessages === null || chatMessages === void 0 ? void 0 : chatMessages.messages);
        });
    }
    getCurrentRoom(model, fromUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromUser = yield this.repository.getDocumentById(model, fromUserId);
            if (!fromUser)
                throw new Error("User Request does not exist");
            const room = fromUser.chats.find((chat) => chat.current === true);
            if (!room)
                throw new Error("No current chat");
            const toCurrentUser = yield this.repository.getDocumentById(model, room.toUser);
            if (!toCurrentUser)
                throw new Error("Contact does not exist in the database");
            return (0, index_1.formateData)(toCurrentUser);
        });
    }
    getPendingMessages(model, fromUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromUser = yield this.repository.getDocumentById(model, fromUserId);
            if (!fromUser)
                throw new Error("User Request does not exist");
            const fromUserChats = fromUser.chats;
            return (0, index_1.formateData)(fromUserChats);
        });
    }
    deletePendingMessages(model, fromUserId, toUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromUser = yield this.repository.getDocumentById(model, fromUserId);
            if (!fromUser)
                throw new Error("User Request does not exist");
            const chat = fromUser === null || fromUser === void 0 ? void 0 : fromUser.chats.find((chat) => chat.toUser == toUserId);
            if (chat !== undefined) {
                fromUser === null || fromUser === void 0 ? void 0 : fromUser.chats.map((chat) => {
                    if (chat.toUser == toUserId) {
                        chat.pendingMessages = 0;
                    }
                });
                //Updates chats
                const updatedChats = yield this.repository.updateDocumentById(model, fromUserId, fromUser === null || fromUser === void 0 ? void 0 : fromUser.chats, "chats");
                return (0, index_1.formateData)(updatedChats);
            }
        });
    }
}
exports.default = ChatService;
