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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const logger = __importStar(require("loglevel"));
dotenv_1.default.config();
const ENV = process.env.NODE_ENV || "development";
logger.enableAll();
const CONFIG = {
    production: {
        app: {
            PORT: process.env.PORT || 4000,
            PRIVATE_KEY: process.env.JWT_SECRET_KEY,
            MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
            EXCHANGE_NAME: process.env.EXCHANGE_NAME,
            USER_SERVICE: "user_service",
            SPOTIFY_SERVICE: "spotify_service",
        },
        logger: {
            warn: logger.warn,
            info: logger.info,
            error: logger.error,
            trace: logger.trace,
            debug: logger.debug,
        },
        db: {
            url: process.env.DB_URL,
        },
    },
    development: {
        app: {
            PORT: process.env.PORT || 4000,
            PRIVATE_KEY: process.env.JWT_SECRET_KEY,
            MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
            EXCHANGE_NAME: process.env.EXCHANGE_NAME,
            USER_SERVICE: "user_service",
            SPOTIFY_SERVICE: "spotify_service",
        },
        logger: {
            warn: logger.warn,
            info: logger.info,
            error: logger.error,
            trace: logger.trace,
            debug: logger.debug,
        },
        db: {
            url: process.env.DB_URL,
        },
    },
    test: {
        app: {
            PORT: process.env.PORT || 4000,
            PRIVATE_KEY: process.env.JWT_SECRET_KEY,
            MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
            EXCHANGE_NAME: process.env.EXCHANGE_NAME,
            USER_SERVICE: "user_service",
            SPOTIFY_SERVICE: "spotify_service",
        },
        logger: {
            warn: logger.warn,
            info: logger.info,
            error: logger.error,
            trace: logger.trace,
            debug: logger.debug,
        },
        db: {
            url: process.env.DB_URL,
        },
    },
};
exports.default = CONFIG[ENV];
