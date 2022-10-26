import IUser from "./user.interface";
import { Types } from "mongoose";

export default interface IChat {
	to: IUser | Types.ObjectId | string;
	current: boolean;
	pendingMessages: number;
	messages: string[];
}
