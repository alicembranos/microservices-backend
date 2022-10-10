import { JwtPayload } from "jsonwebtoken";

export default interface AuthRequest extends Request {
	user: string | JwtPayload;
}
