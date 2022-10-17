import { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import IPayload from "../interfaces/payload.interface";
import config from "../config/config";
import amqplib, { Channel } from "amqplib";
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

//TODO: Refactor
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
	return await bcrypt.genSalt();
};

const generatePassword = async (password: string, salt: string): Promise<string> => {
	return await bcrypt.hash(password, salt);
};

const validatePassword = async (enteredPassword: string, hashedPassword: string, salt: string) => {
	return (await generatePassword(enteredPassword, salt)) === hashedPassword;
};

const generateSignature = async (payload: IPayload) => {
	return await jwt.sign(payload, config.app.PRIVATE_KEY as Secret, { expiresIn: "1d" });
};

const validateSignature = (auth: string): IPayload => {
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

const initSwagger = (app) => {
	app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

const initRedis = async (redisClient: RedisClientType) : Promise<void>=> {
	redisClient = redis.createClient();
	redisClient.on("error", (error) => {
		config.logger.error(error);
	})
	redisClient.on("connection", () => {
		config.logger.info("Redis connected!");
	})
	await redisClient.connect()
};

export {
	selectFieldsToPopulate,
	formateData,
	validatePassword,
	generateSignature,
	validateSignature,
	createChannel,
	publishMessage,
	handleError,
	initSwagger,
	initRedis
};
