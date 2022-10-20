import express from "express";
import config from "./config/config";
import connect from "./database/connect";
import serverApp from "./server";
import { seedDatabase } from "./database/seed";

const StartServer = async () => {
	const app = express();

	connect().then(async function onServerInit() {
		try {
			config.logger.info("DB connected");

			// seed database
			// await seedDatabase();

			serverApp(app);
			// initSwagger(app);
			
			app.listen(config.app.PORT, () => {
				config.logger.info(`Spotify is Listening at port ${config.app.PORT}`);
			});
		} catch (error) {
			config.logger.error("Error connecting to the DB");
		}
	});
};

StartServer();
