import IPayload from "../../interfaces/payload.interface";

export {};

declare global {
	namespace Express {
		interface Request {
			user: IPayload;
		}
	}
}
