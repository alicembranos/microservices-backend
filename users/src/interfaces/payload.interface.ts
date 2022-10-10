import { Types } from "mongoose";

export default interface IPayload {
	sub: string | Types.ObjectId;
	username: string;
}
