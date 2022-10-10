import { JwtPayload } from "jsonwebtoken";

interface BodyPayload {
	// [key: string]: string;
	_id: string;
}

interface UserPayload {
	sub: string;
	username: string;
}

export default interface AuthRequest extends Request {
	user: UserPayload;
}

export { BodyPayload };
