export {};

declare global {
	namespace Express {
		interface Request {
			user: import("../../interfaces/payload.interface").default;
		}
	}
}
