import { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import IPayload from "../interfaces/payload.interface";
import config from "../config/config";
import amqplib, { Channel } from "amqplib";
import UserService from "../services/user-service";
import { Request } from "express";

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

const formateData = <T>(data: T): T => {
	if (data) {
		return data;
	}
	throw new Error("Data Not found!");
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
const generateSignature = async (payload: IPayload) => {
	return await jwt.sign(payload, config.app.PRIVATE_KEY as Secret, { expiresIn: "5d" });
};

const validateSignature = async (req: Request) => {
	const authorization = req.headers["authorization"];
	if (authorization) {
		const payload = await jwt.verify(authorization.split(" ")[1], config.app.PRIVATE_KEY as Secret);
		req.user = payload as IPayload;
		return true;
	}
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

export {
	selectFieldsToPopulate,
	formateData,
	validatePassword,
	generateSignature,
	validateSignature,
	generatePassword,
	handleError,
	createChannel,
	publishMessage,
	subscribeMessage,
};
