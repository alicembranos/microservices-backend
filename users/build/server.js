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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./utils/index");
const index_2 = require("./api/index");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
dotenv_1.default.config();
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use((0, morgan_1.default)("dev"));
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: "50mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/doc", swagger_ui_express_1.default.serve);
    const channel = yield (0, index_1.createChannel)();
    (0, index_2.user)(app, channel);
    (0, index_2.documentation)(app);
    app.use("/", (_req, res) => {
        res.status(200).send("Hello from User Server");
    });
});
