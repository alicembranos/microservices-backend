
interface BodyPayload {
	// [key: string]: string;
	_id: string;
}

interface UserPayload {
	sub: string;
	username: string;
}

export { BodyPayload };
