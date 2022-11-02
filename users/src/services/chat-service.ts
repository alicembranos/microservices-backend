import User from "../repository/user-repository";
import { formateData } from "../utils/index";
import { Model, Types } from "mongoose";
import IChat from "../interfaces/chat.interface";
import IUser from "../interfaces/user.interface";

type Users = {
	id: string;
	idSocket: string;
	usuario: string;
};

//Chat Business logic
class ChatService {
	private repository: User;

	constructor() {
		this.repository = new User();
	}

	async updatePendingMessages<
		T extends {
			chats: IChat[];
		}
	>(
		model: Model<T>,
		fromUserId: IUser | Types.ObjectId | string,
		toUserId: IUser | Types.ObjectId | string,
		users: Users[]
	) {
		const isConnected = users.find((user: Users) => user.id == toUserId);
		if (isConnected === undefined) {
			//Update Receiver User
			const toUser = await this.repository.getDocumentById(model, toUserId);
			if (!toUser) throw new Error("Receiver User does not exist");

			const updateToUserChats = await this.repository.updateNestedObjectInArray(
				model,
				toUserId,
				fromUserId,
				"chats",
				"pendingMessages"
			);

			return formateData(updateToUserChats);
		}
	}

	async updateMessages<
		T extends {
			chats: IChat[];
		}
	>(model: Model<T>, fromUserId: IUser | Types.ObjectId | string, data: Partial<IChat>) {
		const { toUser, messages } = data;
		if (!toUser || !messages) throw new Error("Request body data missed");

		//Update Sender User
		const fromUser = await this.repository.getDocumentById(model, fromUserId);
		if (!fromUser) throw new Error("Sender User does not exist");

		let updatedChatsSender: IChat[] | undefined;
		let updatedChatsReceiver: IChat[] | undefined;

		const chatSenderUser = fromUser?.chats.find((chat: IChat) => chat.toUser == toUser);

		if (chatSenderUser === undefined) {
			const chats = { toUser, messages, current: true, pendingMessages: 0 };
			updatedChatsSender = await this.repository.addChat(model, fromUserId, chats, "chats");
		} else {
			updatedChatsSender = await this.repository.addMessageToChat(
				model,
				fromUserId,
				messages,
				toUser,
				"messages"
			);
			const devuelvesTrue = await this.repository.updateNestedObjectInArrayBoolean(
				model,
				fromUserId,
				true,
				toUser,
				"chats",
				"current"
			);
			console.log(devuelvesTrue, "*********************");
		}

		await this.repository.updateNestedObjectInArrayNotEqual(
			model,
			fromUserId,
			false,
			toUser,
			"chats",
			"current"
		);

		const toUserReceiver = await this.repository.getDocumentById(model, toUser);
		if (!toUserReceiver) throw new Error("Receiver User does not exist");

		//Update Receiver Use
		const chatReceiverUser = toUserReceiver?.chats.find((chat: any) => chat.toUser == fromUserId);
		console.log("chat receiver********", chatReceiverUser);
		if (chatReceiverUser === undefined) {
			const chats = { toUser: fromUserId, messages, current: false, pendingMessages: 0 };
			updatedChatsReceiver = await this.repository.addChat(model, toUser, chats, "chats");
		} else {
			updatedChatsReceiver = await this.repository.addMessageToChat(
				model,
				toUser,
				messages,
				fromUserId,
				"messages"
			);
		}

		return formateData({ updatedChatsSender, updatedChatsReceiver });
	}

	async getMessages<
		T extends {
			chats: IChat[];
		}
	>(
		model: Model<T>,
		fromUserId: IUser | Types.ObjectId | string,
		toUserId: IUser | Types.ObjectId | string
	) {
		const fromUser = await this.repository.getDocumentById(model, fromUserId);
		if (!fromUser) throw new Error("User Request does not exist");

		const chatMessages = fromUser.chats.find((chat: any) => chat.toUser == toUserId);
		return formateData(chatMessages?.messages);
	}

	async getCurrentRoom<
		T extends {
			chats: IChat[];
		}
	>(model: Model<T>, fromUserId: IUser | Types.ObjectId | string) {
		const fromUser = await this.repository.getDocumentById(model, fromUserId);
		if (!fromUser) throw new Error("User Request does not exist");

		const room = fromUser.chats.find((chat: IChat) => chat.current === true);
		if (!room) throw new Error("No current chat");

		const toCurrentUser = await this.repository.getDocumentById(model, room.toUser);
		if (!toCurrentUser) throw new Error("Contact does not exist in the database");

		return formateData(toCurrentUser);
	}

	async getPendingMessages<T extends { chats?: IChat[] }>(
		model: Model<T>,
		fromUserId: IUser | Types.ObjectId | string
	) {
		const fromUser = await this.repository.getDocumentById(model, fromUserId);
		if (!fromUser) throw new Error("User Request does not exist");

		const fromUserChats = fromUser.chats;
		return formateData(fromUserChats);
	}

	async deletePendingMessages<
		T extends {
			chats: IChat[];
		}
	>(model: Model<T>, fromUserId: string, toUserId: IUser) {
		const fromUser = await this.repository.getDocumentById(model, fromUserId);
		if (!fromUser) throw new Error("User Request does not exist");

		const chat = fromUser?.chats.find((chat: IChat) => chat.toUser == toUserId);

		if (chat !== undefined) {

			fromUser?.chats.map((chat: IChat) => {
				if (chat.toUser == toUserId) {
					chat.pendingMessages = 0;
				}
			});

			//Updates chats
			const updatedChats = await this.repository.updateDocumentById(
				model,
				fromUserId,
				fromUser?.chats,
				"chats"
			);
			return formateData(updatedChats);
		}
	}
}

export default ChatService;
