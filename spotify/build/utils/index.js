"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.initSwagger = exports.handleError = exports.publishMessage = exports.createChannel = exports.existTokenInBlacklist = exports.validateSignature = exports.generateSignature = exports.validatePassword = exports.formateData = exports.selectFieldsToPopulate = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const amqplib_1 = __importDefault(require("amqplib"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("../documentation/swagger/swagger.json"));
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
//TODO: Refactor
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
    return "Unexpected error";
};
exports.handleError = handleError;
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
const generatePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
const validatePassword = (enteredPassword, hashedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield generatePassword(enteredPassword, salt)) === hashedPassword;
});
exports.validatePassword = validatePassword;
const generateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.sign(payload, config_1.default.app.PRIVATE_KEY, { expiresIn: "1d" });
});
exports.generateSignature = generateSignature;
const validateSignature = (auth) => {
    const payload = jsonwebtoken_1.default.verify(auth.split(" ")[1], config_1.default.app.PRIVATE_KEY);
    return payload;
};
exports.validateSignature = validateSignature;
const existTokenInBlacklist = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield initRedis_1.default.lPos("token-blacklist", token);
    if ((exist === null || exist === void 0 ? void 0 : exist.toString()) === "nil")
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
        throw new Error(handleError(error));
    }
});
exports.createChannel = createChannel;
const publishMessage = (channel, service, msg) => {
    channel.publish(config_1.default.app.EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
};
exports.publishMessage = publishMessage;
const initSwagger = (app) => {
    app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
};
exports.initSwagger = initSwagger;
