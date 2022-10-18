import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import IPayload from "../interfaces/payload.interface";
import config from "../config/config";
import amqplib, { Channel } from "amqplib";
import UserService from "../services/user-service";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../documentation/swagger/swagger.json";
import { RedisCommandArgument } from "@redis/client/dist/lib/commands";
import redisClient from "./initRedis";

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

const generateSignature = (payload: IPayload): Promise<string | undefined> => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			config.app.PRIVATE_KEY as Secret,
			{ expiresIn: config.app.PRIVATE_EXPIRATION_TIME },
			(error, token) => {
				if (error) return reject(error);
				resolve(token);
			}
		);
	});
};

const generateRefreshSignature = async (payload: IPayload): Promise<string | undefined> => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			config.app.PRIVATE_KEY_REFRESH as Secret,
			{ expiresIn: config.app.PRIVATE_EXPIRATION_TIME_REFRESH },
			async (error, token) => {
				if (error) return reject(error);
				// redisClient.set("token" as RedisCommandArgument, token as RedisCommandArgument);
				redisClient.set(
					payload.sub.toString() as RedisCommandArgument,
					token as RedisCommandArgument,
					{ EX: 31104000 }
				);
				resolve(token);
			}
		);
	});
};

const validateSignature = (auth: string): Promise<IPayload> => {
	return new Promise((resolve, reject) => {
		jwt.verify(auth.split(" ")[1], config.app.PRIVATE_KEY as Secret, (error, payload) => {
			if (error) return reject(error);
			resolve(payload as IPayload);
		});
	});
};

const validateRefreshSignature = async (auth: string): Promise<IPayload> => {
	return new Promise((resolve, reject) => {
		jwt.verify(auth, config.app.PRIVATE_KEY_REFRESH as Secret, async (error, payload) => {
			if (error) return reject(error);
			console.log(payload, "payload####################");
			// const refreshToken = await redisClient.get("token");
			const refreshToken = await redisClient.get(payload?.sub?.toString() as RedisCommandArgument);
			console.log(refreshToken, "refreshToken####################");
			if (!refreshToken) reject("Unauthorized");
			if (refreshToken === auth) {
				resolve(payload as IPayload);
			}
		});
	});
};

const deleteUserCacheToken = async (sub: string | mongoose.Types.ObjectId) => {
	await redisClient.del(sub.toString());
};

const addTokenToBlacklist = async (token: string) => {
	await redisClient.lPush("token-blacklist", token);
	await redisClient.expire("token-blacklist", 3600, "NX"); //1 hour
};

const existTokenInBlacklist = async (token: string): Promise<boolean> => {
	const exist = await redisClient.lPos("token-blacklist", token.split(' ')[1]);
	console.log(exist)
	console.log(typeof exist === "object" && exist === null)
	if (typeof exist === "object" && exist === null) return true;
	return false;
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

export {
	selectFieldsToPopulate,
	formateData,
	validatePassword,
	generateSignature,
	validateSignature,
	generateRefreshSignature,
	validateRefreshSignature,
	deleteUserCacheToken,
	addTokenToBlacklist,
	existTokenInBlacklist,
	generatePassword,
	handleError,
	createChannel,
	publishMessage,
	subscribeMessage,
	initSwagger,
};
