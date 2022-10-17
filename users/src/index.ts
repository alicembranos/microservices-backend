import express from "express";
import config from "./config/config";
import connect from "./database/connect";
import serverApp from "./server";
import { seedDatabase } from "./database/seed";
import { initSwagger, initRedis } from "./utils/index";
import { RedisClientType } from "@redis/client";

const StartServer = async () => {
	const app = express();

	connect().then(async function onServerInit() {
		try {
			config.logger.info("DB connected");

			//seed database
			// await seedDatabase();

			serverApp(app);
			initSwagger(app);
			const redisClient = await initRedis();

			app.listen(config.app.PORT, () => {
				config.logger.info(`User is Listening at port ${config.app.PORT}`);
			});
		} catch (error) {
			config.logger.error("Error connecting to the DB");
		}
	});
};

StartServer();
