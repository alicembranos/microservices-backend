import IUser from './user.interface';

export default interface IChat {
	to: IUser;
	current: boolean;
	pendingMessages: number;
	messages: string[];
}
