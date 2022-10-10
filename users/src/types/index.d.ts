import IPayload from "../interfaces/payload.interface";
import { Request } from "express";

declare global {
	namespace Express {
		interface Request {
			user: import("../interfaces/payload.interface").default;
		}
	}
}

export {};
