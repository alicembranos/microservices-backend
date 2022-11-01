import { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import IPayload from "../interfaces/payload.interface";
import ISearch from "../interfaces/search.interface";
import config from "../config/config";
import amqplib, { Channel } from "amqplib";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../documentation/swagger/swagger.json";

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

//! Expires token is modified
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

const initSwagger = (app) => {
	app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export {
	selectFieldsToPopulate,
	formateData,
	validatePassword,
	generatePassword,
	generateSignature,
	validateSignature,
	createChannel,
	publishMessage,
	convertParamToObject,
	handleError,
	initSwagger,
};
