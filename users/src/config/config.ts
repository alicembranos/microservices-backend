import { GenericConfig } from "../interfaces/config.interface";
import dotenv from "dotenv";
import * as logger from "loglevel";

dotenv.config();

const ENV = process.env.NODE_ENV || "development";

logger.enableAll();

const CONFIG: GenericConfig = {
	production: {
		app: {
			PORT: process.env.PORT || 4000,
			PRIVATE_KEY: process.env.JWT_SECRET_KEY,
			PRIVATE_EXPIRATION_TIME: process.env.JWT_SECRET_TIME,
			PRIVATE_KEY_REFRESH: process.env.JWT_REFRESH_KEY,
			PRIVATE_EXPIRATION_TIME_REFRESH: process.env.JWT_REFRESH_TIME,
			MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
			EXCHANGE_NAME: process.env.EXCHANGE_NAME as string,
			USER_SERVICE: "user_service",
			SPOTIFY_SERVICE: "spotify_service",
		},
		logger: {
			warn: logger.warn,
			info: logger.info,
			error: logger.error,
			trace: logger.trace,
			debug: logger.debug,
		},
		db: {
			url: process.env.DB_URL,
		},
	},
	development: {
		app: {
			PORT: process.env.PORT || 4000,
			PRIVATE_KEY: process.env.JWT_SECRET_KEY,
			PRIVATE_EXPIRATION_TIME: process.env.JWT_SECRET_TIME,
			PRIVATE_KEY_REFRESH: process.env.JWT_REFRESH_KEY,
			PRIVATE_EXPIRATION_TIME_REFRESH: process.env.JWT_REFRESH_TIME,
			MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
			EXCHANGE_NAME: process.env.EXCHANGE_NAME as string,
			USER_SERVICE: "user_service",
			SPOTIFY_SERVICE: "spotify_service",
		},
		logger: {
			warn: logger.warn,
			info: logger.info,
			error: logger.error,
			trace: logger.trace,
			debug: logger.debug,
		},
		db: {
			url: process.env.DB_URL,
		},
	},
	test: {
		app: {
			PORT: process.env.PORT || 4000,
			PRIVATE_KEY: process.env.JWT_SECRET_KEY,
			PRIVATE_EXPIRATION_TIME: process.env.JWT_SECRET_TIME,
			PRIVATE_KEY_REFRESH: process.env.JWT_REFRESH_KEY,
			PRIVATE_EXPIRATION_TIME_REFRESH: process.env.JWT_REFRESH_TIME,
			MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
			EXCHANGE_NAME: process.env.EXCHANGE_NAME as string,
			USER_SERVICE: "user_service",
			SPOTIFY_SERVICE: "spotify_service",
		},
		logger: {
			warn: logger.warn,
			info: logger.info,
			error: logger.error,
			trace: logger.trace,
			debug: logger.debug,
		},
		db: {
			url: process.env.DB_URL,
		},
	},
};

export default CONFIG[ENV];
