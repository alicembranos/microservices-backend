import SpotifyService from "../../services/spotify-service";
import database from "../../models/index";
import { NextFunction, Response, Request } from "express";
import { Channel } from "amqplib";
import auth from "../middlewares/auth.middleware";
import { publishMessage, handleError } from "../../utils";
import config from "../../config/config";
import uploadToCloudinary from "../../utils/cloudinary/cloudinary";

export default (app, channel: Channel) => {
	const service = new SpotifyService();

	app.get("/playlist", auth, async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.getAll(database.Playlist);
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.get(
		"/playlist/:id",
		auth,
		async ({ params: { id } }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.get(database.Playlist, id);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.post(
		"/playlist",
		auth,
		async ({ user: { sub: userId }, body }: Request, res: Response, next: NextFunction) => {
			try {
				const bodyWithUserId = { ...body, userId };

				if (!body.image.includes("res.cloudinary.com")) {
					const secureUrlCloudinary = await uploadToCloudinary(body.image, next);
					// const { secure_url } = await cloudinaryAuth.uploader.upload(
					// 	`data:image/png;base64,${body.image}`,
					// 	{
					// 		upload_preset: "photos",
					// 	},
					// 	function (_error, result) {
					// 		if (_error) throw new Error("Cloudinary Error");
					// 		return result;
					// 	}
					// );
					body.image = secureUrlCloudinary;
				}

				const data = await service.create(database.Playlist, bodyWithUserId);

				const payload = await service.getPlaylistPayload(
					userId,
					database.Playlist,
					data._id,
					"ADD_TO_PLAYLIST"
				);

				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(payload));

				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.patch(
		"/playlist/tracks/:id",
		auth,
		async ({ params: { id }, body }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.updateFromArray(database.Playlist, id, body);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.delete(
		"/playlist/tracks/:id",
		auth,
		async ({ params: { id }, body }: Request, res: Response, _next: NextFunction) => {
			try {
				const data = await service.deleteFromArray(database.Playlist, id, body);
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);

	app.patch(
		"/playlist/:id",
		auth,
		async (
			{ params: { id }, user: { sub: userId }, body }: Request,
			res: Response,
			next: NextFunction
		) => {
			try {
				if (!body.image.includes("res.cloudinary.com")) {
					const secureUrlCloudinary = await uploadToCloudinary(body.image, next);
					// const { secure_url } = await cloudinaryAuth.uploader.upload(
					// 	`data:image/png;base64,${body.image}`,
					// 	{
					// 		upload_preset: "photos",
					// 	},
					// 	function (_error, result) {
					// 		if (_error) throw new Error("Cloudinary Error");
					// 		return result;
					// 	}
					// );
					body.image = secureUrlCloudinary;
				}

				const data = await service.update(database.Playlist, id, body);

				const payload = await service.getPlaylistPayload(
					userId,
					database.Playlist,
					id,
					"UPDATE_PLAYLIST"
				);

				publishMessage(channel, config.app.USER_SERVICE, JSON.stringify(payload));

				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
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

				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);
};
