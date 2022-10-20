import UserService from "../../services/user-service";
import database from "../../models/index";
import { handleError, subscribeMessage } from "../../utils/index";
import { NextFunction, Response, Request, Express } from "express";
import auth from "../middlewares/auth.middleware";
import { Channel } from "amqplib";

export default (app, channel: Channel) => {
	const service = new UserService();

	// To listen
	subscribeMessage(channel, service);

	app.post("/signup", async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const { email, password, username, image, genres } = req.body;
			const data = await service.signUp({ email, password, username, image, genres });
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.post("/signin", async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const { email, password } = req.body;
			const data = await service.signIn({ email, password });
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.get("/user", auth, async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.getAll(database.User);
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.get(
		"/user/:id",
		auth,
		async ({ params: { id } }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.get(database.User, id);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.patch(
		"/user/:id",
		auth,
		async ({ params: { id }, body }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.update(database.User, id, body);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.delete(
		"/user/:id",
		auth,
		async ({ params: { id } }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.delete(database.User, id);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);
};
