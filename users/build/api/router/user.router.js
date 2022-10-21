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
const user_service_1 = __importDefault(require("../../services/user-service"));
const index_1 = __importDefault(require("../../models/index"));
const index_2 = require("../../utils/index");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
exports.default = (app, channel) => {
    const service = new user_service_1.default();
    // To listen
    (0, index_2.subscribeMessage)(channel, service);
    app.post("/signup", (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, username, image } = req.body;
            const data = yield service.signUp({ email, password, username, image });
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(401).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.post("/signin", (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const data = yield service.signIn({ email, password });
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(401).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.get("/auth", auth_middleware_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return res.status(200).json({ ok: true, data: '' });
        }
        catch (error) {
            res.status(401).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.post("/token", (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            const data = yield service.refreshToken(refreshToken);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.delete("/logout", auth_middleware_1.default, (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { refreshToken } = req.body;
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const data = yield service.logout(token, refreshToken);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.get("/user", auth_middleware_1.default, (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.getAll(index_1.default.User);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.get("/user/:id", auth_middleware_1.default, ({ params: { id } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.get(index_1.default.User, id);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.patch("/user/:id", auth_middleware_1.default, ({ params: { id }, body }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.update(index_1.default.User, id, body);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
    app.delete("/user/:id", auth_middleware_1.default, ({ params: { id } }, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield service.delete(index_1.default.User, id);
            return res.status(200).json({ ok: true, data });
        }
        catch (error) {
            res.status(400).json({ ok: false, msg: (0, index_2.handleError)(error) });
        }
    }));
};
