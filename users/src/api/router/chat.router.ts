import ChatService from "../../services/chat-service";
import database from "../../models/index";
import { handleError } from "../../utils/index";
import { NextFunction, Response, Request } from "express";
import auth from "../middlewares/auth.middleware";

export default (app) => {
	const chatService = new ChatService();

	app.post(
		"/chat/messages",
		auth,
		async ({ user: { sub: userId }, body }: Request, res: Response) => {
			const { toUser, messages, users } = body;

			try {
				const data = await chatService.updateMessages(database.User, userId, { toUser, messages });
				const result = await chatService.updatePendingMessages(
					database.User,
					userId,
					toUser,
					users
				);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.post(
		"/chat/getMessages",
		auth,
		async ({ user: { sub: userId }, body }: Request, res: Response, _next: NextFunction) => {
			const { toUserId } = body;
			try {
				const data = await chatService.getMessages(database.User, userId, toUserId);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.post(
		"/chat/currentRoom",
		auth,
		async ({ user: { sub: userId } }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await chatService.getCurrentRoom(database.User, userId);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.post(
		"/chat/pendingMessages",
		auth,
		async ({ user: { sub: userId } }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await chatService.getPendingMessages(database.User, userId);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);
	app.post(
		"/chat/deletePendingMessages",
		auth,
		async (
			{ user: { sub: userId }, body: { toUserId } }: Request,
			res: Response,
			_next: NextFunction
		) => {
			try {
				const data = await chatService.deletePendingMessages(
					database.User,
					userId as string,
					toUserId
				);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);
};
