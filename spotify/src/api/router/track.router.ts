import SpotifyService from "../../services/spotify-service";
import database from "../../models/index";
import { NextFunction, Response, Request } from "express";
import { BodyPayload } from "../../interfaces/request.interface";
import auth from "../middlewares/auth.middleware";
import { publishMessage, handleError } from "../../utils/index";
import { Channel } from "amqplib";
import config from "../../config/config";
import uploadToCloudinary from "../../utils/cloudinary/cloudinary";
import uuid4 from "uuid4";

export default (app, channel: Channel) => {
	const service = new SpotifyService();

	app.get("/track", async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.getAll(database.Track);
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.post("/track", async ({ body }: Request, res: Response, _next: NextFunction) => {
		try {
			let { title, trackAudio } = body;
			// if (!title || !trackAudio)
			// 	return res.status(400).json({ ok: false, msg: "All fields are required" });

			// // const {secureUrlCloudinary, duration} = await uploadToCloudinary(trackAudio);
			// trackAudio = secureUrlCloudinary;

			// const _id = uuid4();
			// // const

			// const data = await service.create(database.Track, { _id, title, trackAudio });
			// return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
		}
	});

	app.get("/track/:id", async ({ params: { id } }: Request, res: Response, _next: NextFunction) => {
		try {
			const data = await service.get(database.Track, id);
			return res.status(200).json({ ok: true, data });
		} catch (error) {
			res.status(400).json({ ok: false, msg: handleError(error) });
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
				return res.status(200).json({ ok: true, data });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);
};
