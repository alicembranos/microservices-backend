import SpotifyService from "../../services/spotify-service";
import database from "../../models/index";
import { NextFunction, Response, Request } from "express";
import auth from "../middlewares/auth.middleware";
import { BodyPayload } from "../../interfaces/request.interface";
import { publishMessage, handleError } from "../../utils";
import config from "../../config/config";
import { Channel } from "amqplib";

export default (app, channel: Channel) => {
	const service = new SpotifyService();

	app.get("/album", async (_, res: Response, _next: NextFunction) => {
		try {
			const data = await service.getAll(database.Album);
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.get("/album/:id", async ({ params: { id } }: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.get(database.Album, id);
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.put(
		"/album/library",
		auth,
		async (
			{ user: { sub }, body: { _id } }: Request<{}, any, BodyPayload>,
			res: Response,
			_next: NextFunction
		) => {
			try {
				const data = await service.getLibraryPayload(
					sub,
					database.Album,
					_id,
					"ADD_TO_LIBRARY",
					"albums"
				);
				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(data));
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);
};
