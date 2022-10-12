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

	app.post(
		"/playlist",
		auth,
		async ({ user: { sub: userId }, body }: Request, res: Response, _next: NextFunction) => {
			try {
				const bodyWithUserId = { ...body, userId };
				const data = await service.create(database.Playlist, bodyWithUserId);

				const payload = await service.getPlaylistPayload(
					userId,
					database.Playlist,
					data._id,
					"ADD_TO_PLAYLIST"
				);

				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(payload));

				return res.status(200).send({ ok: true, data });
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);

	//! not allow to modify title, image or description from the front
	app.patch(
		"/playlist/:id",
		auth,
		async ({ params: { id }, body }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.updateArray(database.Playlist, id, body);
				return res.status(200).send({ ok: true, data });
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.delete(
		"/playlist/:id",
		auth,
		async (
			{ params: { id }, user: { sub: userId } }: Request,
			res: Response,
			_next: NextFunction
		) => {
			try {
				const payload = await service.getPlaylistPayload(
					userId,
					database.Playlist,
					id,
					"REMOVE_FROM_PLAYLIST"
				);

				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(payload));

				const data = await service.delete(database.Playlist, id);

				return res.status(200).send({ ok: true, data });
			} catch (error) {
				res.status(400).send({ ok: false, msg: handleError(error) });
			}
		}
	);
};
