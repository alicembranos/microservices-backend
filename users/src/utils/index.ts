import { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import IPayload from "../interfaces/payload.interface";
import config from "../config/config";
import amqplib, { Channel } from "amqplib";
import UserService from "../services/user-service";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../documentation/swagger/swagger.json";
import redis from "redis";
import { RedisClientType } from "@redis/client";

const selectFieldsToPopulate = <T>(model: Model<T>): string | string[] => {
	switch (model.modelName) {
		case "Artist":
			return ["tracks", "albums"];
		case "Album":
			return ["tracks", "artist"];
		case "Track":
			return "album";
		case "Playlist":
			return "tracks";
		default:
			return "";
	}
};

const formateData = (data: any) => {
	if (data?.length === 0 || !data) {
		throw new Error("Data Not found!");
	}
	return data;
};


const handleError = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	return "Unexpected error";
};

const generateSalt = async (): Promise<string> => {
	return await bcrypt.genSalt(10);
};

const generatePassword = async (password: string): Promise<string> => {
	const salt = await generateSalt();
	return await bcrypt.hash(password, salt);
};

const validatePassword = async (enteredPassword: string, hashedPassword: string) => {
	return await bcrypt.compare(enteredPassword, hashedPassword);
};

//! Expires token is modified
const generateSignature = (payload: IPayload) => {
	return jwt.sign(payload, config.app.PRIVATE_KEY as Secret, {
		expiresIn: config.app.PRIVATE_EXPIRATION_TIME,
	});
};

const generateRefreshSignature = (payload: IPayload) => {
	return jwt.sign(payload, config.app.PRIVATE_KEY_REFRESH as Secret, {
		expiresIn: config.app.PRIVATE_EXPIRATION_TIME_REFRESH,
	});
};

const validateSignature = (auth: string): IPayload => {
	const payload = jwt.verify(auth.split(" ")[1], config.app.PRIVATE_KEY as Secret) as IPayload;
	return payload;
};

const validateRefreshSignature = (auth: string): IPayload => {
	const payload = jwt.verify(auth.split(" ")[1], config.app.PRIVATE_KEY as Secret) as IPayload;
	return payload;
};

//Message broker
const createChannel = async (): Promise<Channel> => {
	try {
		const connection = await amqplib.connect(config.app.MSG_QUEUE_URL as string);
		const channel = await connection.createChannel();
		await channel.assertQueue(config.app.EXCHANGE_NAME as string, { durable: true });
		return channel;
	} catch (error) {
		throw new Error(handleError(error));
	}
};

const publishMessage = (channel: Channel, service: string, msg: string) => {
	channel.publish(config.app.EXCHANGE_NAME as string, service, Buffer.from(msg));
	console.log("Sent: ", msg);
};

const subscribeMessage = async (channel: Channel, service: UserService) => {
	await channel.assertExchange(config.app.EXCHANGE_NAME, "direct", { durable: true });
	const q = await channel.assertQueue("", { exclusive: true });
	console.log(`Waiting for messages in queue: ${q.queue}`);

	channel.bindQueue(q.queue, config.app.EXCHANGE_NAME, config.app.USER_SERVICE);

	channel.consume(
		q.queue,
		(msg) => {
			if (msg?.content) {
				console.log("The message is :", msg.content.toString());
				service.subscribeEvents(msg.content.toString());
			}
			console.log("[X] received");
		},
		{ noAck: true }
	);
};

const initSwagger = (app) => {
	app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

const initRedis = async ()  => {
	const redisClient = redis.createClient();

	redisClient.on("error", (error) => {
		config.logger.error(error);
	});
	redisClient.on("connection", () => {
		config.logger.info("Redis connected!");
	});
	redisClient.on("ready", () => {
		config.logger.info("Redis ready!");
	});

	await redisClient.connect();

	return redisClient;
};



export {
	selectFieldsToPopulate,
	formateData,
	validatePassword,
	generateSignature,
	validateSignature,
	generateRefreshSignature,
	validateRefreshSignature,
	generatePassword,
	handleError,
	createChannel,
	publishMessage,
	subscribeMessage,
	initSwagger,
	initRedis,
};
