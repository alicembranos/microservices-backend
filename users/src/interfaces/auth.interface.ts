interface Ilogin {
	email: string;
	password: string;
}

interface ISignUp extends Ilogin {
	username: string;
	image: string;
	genres: string[];
}

export { Ilogin, ISignUp };
