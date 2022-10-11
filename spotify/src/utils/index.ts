import { Model } from "mongoose";
import { Request } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import IPayload from "../interfaces/payload.interface";
import config from "../config/config";
import amqplib, { Channel } from "amqplib";

/**
 * It takes a Mongoose model and returns a string or array of strings that represent the fields to
 * populate
 * @param model - The model that you want to populate.
 * @returns A function that takes a model and returns a string or string array.
 */
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
const formateData = <T>(data: T) => {
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

const validateSignature = async (req: Request) => {
	const authorization = req.headers["authorization"];
	if (authorization) {
		const payload = (await jwt.verify(
			authorization.split(" ")[1],
			config.app.PRIVATE_KEY as Secret
		)) as IPayload;
		req.user = payload;
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

export {
	selectFieldsToPopulate,
	formateData,
	validatePassword,
	generateSignature,
	validateSignature,
	createChannel,
	publishMessage,
	handleError,
};
