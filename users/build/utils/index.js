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
exports.initSwagger = exports.subscribeMessage = exports.publishMessage = exports.createChannel = exports.handleError = exports.generatePassword = exports.existTokenInBlacklist = exports.addTokenToBlacklist = exports.deleteUserCacheToken = exports.validateRefreshSignature = exports.generateRefreshSignature = exports.validateSignature = exports.generateSignature = exports.validatePassword = exports.formateData = exports.selectFieldsToPopulate = void 0;
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
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, config_1.default.app.PRIVATE_KEY, { expiresIn: config_1.default.app.PRIVATE_EXPIRATION_TIME }, (error, token) => {
            if (error)
                return reject(error);
            resolve(token);
        });
    });
};
exports.generateSignature = generateSignature;
const generateRefreshSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, config_1.default.app.PRIVATE_KEY_REFRESH, { expiresIn: config_1.default.app.PRIVATE_EXPIRATION_TIME_REFRESH }, (error, token) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                return reject(error);
            // redisClient.set("token" as RedisCommandArgument, token as RedisCommandArgument);
            initRedis_1.default.set(payload.sub.toString(), token, { EX: 31104000 });
            resolve(token);
        }));
    });
});
exports.generateRefreshSignature = generateRefreshSignature;
const validateSignature = (auth) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(auth.split(" ")[1], config_1.default.app.PRIVATE_KEY, (error, payload) => {
            if (error)
                return reject(error);
            resolve(payload);
        });
    });
};
exports.validateSignature = validateSignature;
const validateRefreshSignature = (auth) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(auth, config_1.default.app.PRIVATE_KEY_REFRESH, (error, payload) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (error)
                return reject(error);
            console.log(payload, "payload####################");
            // const refreshToken = await redisClient.get("token");
            const refreshToken = yield initRedis_1.default.get((_a = payload === null || payload === void 0 ? void 0 : payload.sub) === null || _a === void 0 ? void 0 : _a.toString());
            console.log(refreshToken, "refreshToken####################");
            if (!refreshToken)
                reject("Unauthorized");
            if (refreshToken === auth) {
                resolve(payload);
            }
        }));
    });
});
exports.validateRefreshSignature = validateRefreshSignature;
const deleteUserCacheToken = (sub) => __awaiter(void 0, void 0, void 0, function* () {
    yield initRedis_1.default.del(sub.toString());
});
exports.deleteUserCacheToken = deleteUserCacheToken;
const addTokenToBlacklist = (token) => __awaiter(void 0, void 0, void 0, function* () {
    yield initRedis_1.default.lPush("token-blacklist", token);
    yield initRedis_1.default.expire("token-blacklist", 3600, "NX"); //1 hour
});
exports.addTokenToBlacklist = addTokenToBlacklist;
const existTokenInBlacklist = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield initRedis_1.default.lPos("token-blacklist", token.split(' ')[1]);
    console.log(exist);
    console.log(typeof exist === "object" && exist === null);
    if (typeof exist === "object" && exist === null)
        return true;
    return false;
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
const subscribeMessage = (channel, service) => __awaiter(void 0, void 0, void 0, function* () {
    yield channel.assertExchange(config_1.default.app.EXCHANGE_NAME, "direct", { durable: true });
    const q = yield channel.assertQueue("", { exclusive: true });
    console.log(`Waiting for messages in queue: ${q.queue}`);
    channel.bindQueue(q.queue, config_1.default.app.EXCHANGE_NAME, config_1.default.app.USER_SERVICE);
    channel.consume(q.queue, (msg) => {
        if (msg === null || msg === void 0 ? void 0 : msg.content) {
            console.log("The message is :", msg.content.toString());
            service.subscribeEvents(msg.content.toString());
        }
        console.log("[X] received");
    }, { noAck: true });
});
exports.subscribeMessage = subscribeMessage;
const initSwagger = (app) => {
    app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
};
exports.initSwagger = initSwagger;
