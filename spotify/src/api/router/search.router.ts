import SpotifyService from "../../services/spotify-service";
import database from "../../models/index";
import { NextFunction, Response, Request } from "express";
import { handleError } from "../../utils";

export default (app) => {
	const service = new SpotifyService();

	app.get(
		"/search/:param",
		async ({ params: { param } }: Request, res: Response, _next: NextFunction) => {
			try {
				const albums = await service.search(database.Album, param);
				const artists = await service.search(database.Artist, param);
				const tracks = await service.search(database.Track, param);
				const playlists = await service.search(database.Playlist, param);

				return res.status(200).json({ ok: true, data: { albums, artists, tracks, playlists } });
			} catch (error) {
				res.status(400).json({ ok: false, msg: handleError(error) });
			}
		}
	);
};
