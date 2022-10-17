import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { createChannel } from "./utils/index";
import { user } from "./api/index";

dotenv.config();

export default async (app) => {
	app.use(morgan("dev"));
	app.use(helmet());
	app.use(cors());
	app.use(express.json({ limit: "50mb" }));
	app.use(express.urlencoded({ extended: true }));

	const channel = await createChannel();
	user(app, channel);

	app.use("/", (_req: Request, res: Response) => {
		res.status(200).send("Hello from User Server");
	});
};
