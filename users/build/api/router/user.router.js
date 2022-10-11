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
var user_service_1 = __importDefault(require("../../services/user-service"));
var index_1 = __importDefault(require("../../models/index"));
var index_2 = require("../../utils/index");
var auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
exports.default = (function (app, channel) {
    var service = new user_service_1.default();
    // To listen
    (0, index_2.subscribeMessage)(channel, service);
    app.post("/signup", function (req, res, _next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, username, image, data, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, email = _a.email, password = _a.password, username = _a.username, image = _a.image;
                    return [4 /*yield*/, service.signUp({ email: email, password: password, username: username, image: image })];
                case 1:
                    data = _b.sent();
                    return [2 /*return*/, res.status(200).send({ ok: true, data: data })];
                case 2:
                    error_1 = _b.sent();
                    res.status(400).send({ ok: false, msg: (0, index_2.handleError)(error_1) });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/signin", function (req, res, _next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, data, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, email = _a.email, password = _a.password;
                    return [4 /*yield*/, service.signIn({ email: email, password: password })];
                case 1:
                    data = _b.sent();
                    return [2 /*return*/, res.status(200).send({ ok: true, data: data })];
                case 2:
                    error_2 = _b.sent();
                    res.status(400).send({ ok: false, msg: (0, index_2.handleError)(error_2) });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/user", auth_middleware_1.default, function (_req, res, _next) { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, service.getAll(index_1.default.User)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, res.status(200).send({ ok: true, data: data })];
                case 2:
                    error_3 = _a.sent();
                    res.status(400).send({ ok: false, msg: (0, index_2.handleError)(error_3) });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/user/:id", auth_middleware_1.default, function (_a, res, _next) {
        var id = _a.params.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, service.get(index_1.default.User, id)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).send({ ok: true, data: data })];
                    case 2:
                        error_4 = _b.sent();
                        res.status(400).send({ ok: false, msg: (0, index_2.handleError)(error_4) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
    app.patch("/user/:id", auth_middleware_1.default, function (_a, res, _next) {
        var id = _a.params.id, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, service.update(index_1.default.User, id, body)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).send({ ok: true, data: data })];
                    case 2:
                        error_5 = _b.sent();
                        res.status(400).send({ ok: false, msg: (0, index_2.handleError)(error_5) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
    app.delete("/user/:id", auth_middleware_1.default, function (_a, res, _next) {
        var id = _a.params.id;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, service.delete(index_1.default.User, id)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).send({ ok: true, data: data })];
                    case 2:
                        error_6 = _b.sent();
                        res.status(400).send({ ok: false, msg: (0, index_2.handleError)(error_6) });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
});
