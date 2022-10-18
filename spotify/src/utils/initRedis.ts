import * as redis from "redis";
import config from "../config/config";

let redisClient = redis.createClient({
	legacyMode: false,
	socket: {
		port: 6379,
		host: "redis",
	},
});

redisClient.on("error", (error) => {
	config.logger.error(error);
});

redisClient.on("connection", () => {
	config.logger.info("Redis connected!");
});

redisClient.on("ready", () => {
	config.logger.info("Redis ready!");
});

redisClient.connect().catch(console.error);

export default redisClient;
