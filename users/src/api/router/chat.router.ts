import UserService from "../../services/user-service";
import database from "../../models/index";
import { handleError, subscribeMessage } from "../../utils/index";
import { NextFunction, Response, Request } from "express";
import auth from "../middlewares/auth.middleware";
import { Channel } from "amqplib";
import uploadToCloudinary from "../../utils/cloudinary/cloudinary";

export default (app) => {
	const service = new UserService();


	app.get("/auth", auth, async (_req, res: Response) => {
		try {
			return res.status(200).json({ ok: true, data: "" });
		} catch (error) {
			res.status(401).json({ ok: false, msg: handleError(error) });
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

	app.get("/user/:id", auth, async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const {
				params: { id },
			} = req;
			console.log(req);
			const data = await service.get(database.User, id);
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.patch(
		"/user/:id",
		auth,
		async (
			{ params: { id }, user: { sub: userId }, body }: Request,
			res: Response,
			_next: NextFunction
		) => {
			if (id !== userId) return res.status(401).json({ ok: true, msg: "Not authorized" });

			if (!body.image?.includes("res.cloudinary.com")) {
				const secureUrlCloudinary = await uploadToCloudinary(body.image);
				body.image = secureUrlCloudinary;
			}

			try {
				const data = await service.update(database.User, id, body);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

};
