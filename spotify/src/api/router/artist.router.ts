import SpotifyService from "../../services/spotify-service";
import database from "../../models/index";
import { NextFunction, Response, Request } from "express";
import { BodyPayload } from "../../interfaces/request.interface";
import auth from "../middlewares/auth.middleware";
import { publishMessage, handleError } from "../../utils";
import config from "../../config/config";
import { Channel } from "amqplib";

export default (app, channel: Channel) => {
	const service = new SpotifyService();

	app.get("/artist", async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.getAll(database.Artist);
			return res.status(200).send({ ok: true, data });
		} catch (error) {
			res.status(400).send({ ok: false, msg: handleError(error) });
		}
	});

	app.get(
		"/artist/:id",
		async ({ params: { id } }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.get(database.Artist, id);
				return res.status(200).send({ ok: true, data });
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.get("/genre", async ({ query }: Request, res: Response, _next: NextFunction) => {
		try {
			console.log(query);
			const data = await service.filter(database.Artist, query);
			return res.status(200).send({ ok: true, data });
		} catch (error) {
			res.status(400).send({ ok: false, msg: handleError(error) });
		}
	});

	app.put(
		"/artist/library",
		auth,
		async (
			{ user: { sub }, body: { _id } }: Request<{}, any, BodyPayload>,
			res: Response,
			_next: NextFunction
		) => {
			try {
				const data = await service.getLibraryPayload(
					sub,
					database.Artist,
					_id,
					"ADD_TO_LIBRARY",
					"artists"
				);
				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(data));
				return res.status(200).send({ ok: true, data });
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);
};
