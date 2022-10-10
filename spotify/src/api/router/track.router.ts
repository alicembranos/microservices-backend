import SpotifyService from "../../services/spotify-service";
import database from "../../models/index";
import { NextFunction, Response, Request } from "express";
import { BodyPayload } from "../../interfaces/request.interface";
import auth from "../middlewares/auth.middleware";
import { publishMessage, handleError } from "../../utils/index";
import { Channel } from "amqplib";
import config from "../../config/config";

export default (app, channel: Channel) => {
	const service = new SpotifyService();

	app.get("/track", async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.getAll(database.Track);
			return res.status(200).send({ ok: true, data });
		} catch (error) {
			res.status(400).send({ ok: false, msg: handleError(error) });
		}
	});

	app.get("/track/:id", async ({ params: { id } }: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.get(database.Track, id);
			return res.status(200).send({ ok: true, data });
		} catch (error) {
			res.status(400).send({ ok: false, msg: handleError(error) });
		}
	});

	app.put(
		"/track/library",
		auth,
		async (
			{ user: { sub }, body: { _id } }: Request<{}, any, BodyPayload>,
			res: Response,
			_next: NextFunction
		) => {
			try {
				const data = await service.getLibraryPayload(
					sub,
					database.Track,
					_id,
					"ADD_TO_LIBRARY",
					"likedSongs"
				);

				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(data));
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);
};