import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { createChannel } from "./utils/index";
import { artists, albums, tracks, playlists, documentation } from "./api/index";
import swaggerUi from "swagger-ui-express";

dotenv.config();

export default async (app) => {
	app.use(morgan("dev"));
	app.use(helmet());
	app.use(cors());
	app.use(express.json({ limit: "50mb" }));
	app.use(express.urlencoded({ extended: true }));
	app.use("/doc", swaggerUi.serve);

	const channel = await createChannel();
	artists(app, channel);
	albums(app, channel);
	tracks(app, channel);
	playlists(app, channel);
	documentation(app);

	app.use("/", (_req: Request, res: Response) => {
		res.status(200).send("Hello from Spotify Server");
	});
};
