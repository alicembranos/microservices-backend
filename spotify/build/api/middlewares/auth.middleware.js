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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/index");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers["authorization"];
    try {
        if (!authorization)
            return res.status(401).json({ ok: false, msg: (0, index_1.handleError)("Not authorized") });
        //check if exist in blacklist
        const exist = yield (0, index_1.existTokenInBlacklist)(authorization);
        if (exist)
            return res.status(401).json({ ok: false, msg: (0, index_1.handleError)("Please sign in.") });
        const payload = (0, index_1.validateSignature)(authorization);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({ ok: false, msg: (0, index_1.handleError)(error) });
    }
});
