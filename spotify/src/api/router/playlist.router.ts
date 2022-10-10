import SpotifyService from "../../services/spotify-service";
import database from "../../models/index";
import { NextFunction, Response, Request } from "express";
import { Channel } from "amqplib";
import auth from "../middlewares/auth.middleware";
import { publishMessage, handleError } from "../../utils";
import config from "../../config/config";

export default (app, channel: Channel) => {
	const service = new SpotifyService();

	app.get("/playlist", auth, async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.getAll(database.Playlist);
			return res.status(200).send({ ok: true, data });
		} catch (error) {
			res.status(400).send({ ok: false, msg: handleError(error) });
		}
	});

	app.get(
		"/playlist/:id",
		auth,
		async ({ params: { id } }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.get(database.Playlist, id);
				return res.status(200).send({ ok: true, data });
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.post("/playlist", auth, async ({ body }: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.create(database.Playlist, body);
			return res.status(200).send({ ok: true, data });
		} catch (error) {
			res.status(400).send({ ok: false, msg: handleError(error) });
		}
	});

	app.patch(
		"/playlist/:id",
		auth,
		async (
			{ params: { id }, user: { sub }, body }: Request,
			res: Response,
			_next: NextFunction
		) => {
			try {
				const data = await service.update(database.Playlist, id, body);

				const payload = await service.getPlaylistPayload(
					sub,
					database.Playlist,
					id,
					"ADD_TO_PLAYLIST"
				);

				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(payload));

				return res.status(200).send({ ok: true, data });
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.delete(
		"/playlist/:id",
		auth,
		async ({ params: { id }, user: { sub } }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.delete(database.Playlist, id);

				const payload = await service.getPlaylistPayload(
					sub,
					database.Playlist,
					id,
					"REMOVE_FROM_PLAYLIST"
				);

				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(payload));

				return res.status(200).send({ ok: true, data });
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);
};
