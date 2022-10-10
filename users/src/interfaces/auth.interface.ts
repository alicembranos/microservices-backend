interface Ilogin {
	email: string;
	password: string;
}

interface ISignUp extends Ilogin {
	username: string;
	image: string;
}

export { Ilogin, ISignUp };
