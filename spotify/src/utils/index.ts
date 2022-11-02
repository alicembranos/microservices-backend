import { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import IPayload from "../interfaces/payload.interface";
import ISearch from "../interfaces/search.interface";
import config from "../config/config";
import amqplib, { Channel } from "amqplib";
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

const handleError = (error: unknown): string | unknown => {
	if (error instanceof Error) {
		return error.message;
	}
	return error;
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

const generateSignature = (payload: IPayload) => {
	return jwt.sign(payload, config.app.PRIVATE_KEY as Secret, { expiresIn: "5d" });
};

const validateSignature = (auth: string): IPayload => {
	const payload = jwt.verify(auth.split(" ")[1], config.app.PRIVATE_KEY as Secret) as IPayload;
	return payload;
};

const convertParamToObject = <T>(model: Model<T>, data: string): ISearch => {
	switch (model.modelName) {
		case "Artist":
			return { name: data };
		case "Album":
		case "Track":
		case "Playlist":
			return { title: data };
		default:
			return {};
	}
};

const existTokenInBlacklist = async (token: string): Promise<boolean> => {
	const exist = await redisClient.lPos("token-blacklist", token.split(" ")[1]);
	if (typeof exist === "object" && exist === null) return false;
	return true;
};

//Message broker
const createChannel = async (): Promise<Channel> => {
	try {
		const connection = await amqplib.connect(config.app.MSG_QUEUE_URL as string);
		const channel = await connection.createChannel();
		await channel.assertQueue(config.app.EXCHANGE_NAME as string, { durable: true });
		return channel;
	} catch (error) {
		throw error;
	}
};

const publishMessage = (channel: Channel, service: string, msg: string) => {
	channel.publish(config.app.EXCHANGE_NAME as string, service, Buffer.from(msg));
	console.log("Sent: ", msg);
};


export {
	selectFieldsToPopulate,
	formateData,
	validatePassword,
	generatePassword,
	generateSignature,
	validateSignature,
	existTokenInBlacklist,
	createChannel,
	publishMessage,
	convertParamToObject,
	handleError
};
