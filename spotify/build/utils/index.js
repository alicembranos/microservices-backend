"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.convertParamToObject = exports.publishMessage = exports.createChannel = exports.existTokenInBlacklist = exports.validateSignature = exports.generateSignature = exports.generatePassword = exports.validatePassword = exports.formateData = exports.selectFieldsToPopulate = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const amqplib_1 = __importDefault(require("amqplib"));
const initRedis_1 = __importDefault(require("./initRedis"));
const selectFieldsToPopulate = (model) => {
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
exports.selectFieldsToPopulate = selectFieldsToPopulate;
const formateData = (data) => {
    if ((data === null || data === void 0 ? void 0 : data.length) === 0 || !data) {
        throw new Error("Data Not found!");
    }
    return data;
};
exports.formateData = formateData;
const handleError = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    return error;
};
exports.handleError = handleError;
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt(10);
});
const generatePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield generateSalt();
    return yield bcrypt_1.default.hash(password, salt);
});
exports.generatePassword = generatePassword;
const validatePassword = (enteredPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(enteredPassword, hashedPassword);
});
exports.validatePassword = validatePassword;
const generateSignature = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.app.PRIVATE_KEY, { expiresIn: "5d" });
};
exports.generateSignature = generateSignature;
const validateSignature = (auth) => {
    const payload = jsonwebtoken_1.default.verify(auth.split(" ")[1], config_1.default.app.PRIVATE_KEY);
    return payload;
};
exports.validateSignature = validateSignature;
const convertParamToObject = (model, data) => {
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
exports.convertParamToObject = convertParamToObject;
const existTokenInBlacklist = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield initRedis_1.default.lPos("token-blacklist", token.split(" ")[1]);
    if (typeof exist === "object" && exist === null)
        return false;
    return true;
});
exports.existTokenInBlacklist = existTokenInBlacklist;
//Message broker
const createChannel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(config_1.default.app.MSG_QUEUE_URL);
        const channel = yield connection.createChannel();
        yield channel.assertQueue(config_1.default.app.EXCHANGE_NAME, { durable: true });
        return channel;
    }
    catch (error) {
        throw error;
    }
});
exports.createChannel = createChannel;
const publishMessage = (channel, service, msg) => {
    channel.publish(config_1.default.app.EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
};
exports.publishMessage = publishMessage;
