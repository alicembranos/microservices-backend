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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.publishMessage = exports.createChannel = exports.validateSignature = exports.generateSignature = exports.validatePassword = exports.formateData = exports.selectFieldsToPopulate = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("../config/config"));
var amqplib_1 = __importDefault(require("amqplib"));
/**
 * It takes a Mongoose model and returns a string or array of strings that represent the fields to
 * populate
 * @param model - The model that you want to populate.
 * @returns A function that takes a model and returns a string or string array.
 */
var selectFieldsToPopulate = function (model) {
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
var formateData = function (data) {
    if (data) {
        return data;
    }
    throw new Error("Data Not found!");
};
exports.formateData = formateData;
var handleError = function (error) {
    if (error instanceof Error) {
        return error.message;
    }
    return "Unexpected error";
};
exports.handleError = handleError;
var generateSalt = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcrypt_1.default.genSalt()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var generatePassword = function (password, salt) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var validatePassword = function (enteredPassword, hashedPassword, salt) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, generatePassword(enteredPassword, salt)];
            case 1: return [2 /*return*/, (_a.sent()) === hashedPassword];
        }
    });
}); };
exports.validatePassword = validatePassword;
var generateSignature = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, jsonwebtoken_1.default.sign(payload, config_1.default.app.PRIVATE_KEY, { expiresIn: "1d" })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.generateSignature = generateSignature;
var validateSignature = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authorization = req.headers["authorization"];
                if (!authorization) return [3 /*break*/, 2];
                return [4 /*yield*/, jsonwebtoken_1.default.verify(authorization.split(" ")[1], config_1.default.app.PRIVATE_KEY)];
            case 1:
                payload = (_a.sent());
                req.user = payload;
                return [2 /*return*/, true];
            case 2: return [2 /*return*/, false];
        }
    });
}); };
exports.validateSignature = validateSignature;
//Message broker
var createChannel = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, channel, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, amqplib_1.default.connect(config_1.default.app.MSG_QUEUE_URL)];
            case 1:
                connection = _a.sent();
                return [4 /*yield*/, connection.createChannel()];
            case 2:
                channel = _a.sent();
                return [4 /*yield*/, channel.assertQueue(config_1.default.app.EXCHANGE_NAME, { durable: true })];
            case 3:
                _a.sent();
                return [2 /*return*/, channel];
            case 4:
                error_1 = _a.sent();
                throw new Error(handleError(error_1));
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createChannel = createChannel;
var publishMessage = function (channel, service, msg) {
    channel.publish(config_1.default.app.EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
};
exports.publishMessage = publishMessage;
