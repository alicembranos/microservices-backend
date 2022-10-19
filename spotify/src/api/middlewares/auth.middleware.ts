import { handleError, validateSignature} from "../../utils/index";
import { Response, NextFunction, Request } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
	const authorization = req.headers["authorization"];
	try {
		if (!authorization)
			return res.status(401).json({ ok: false, msg: handleError("Not authorized") });

		//check if exist in blacklist
		//comunicate with users server

		const payload = validateSignature(authorization);
		req.user = payload;
		next();
	} catch (error) {
		res.status(401).json({ ok: false, msg: handleError(error) });
	}
};
