import { handleError, validateSignature, existTokenInBlacklist } from "../../utils/index";
import { Response, NextFunction, Request } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
	const authorization = req.headers["authorization"];
	try {
		if (!authorization)
			return res.status(401).json({ ok: false, msg: handleError("Not authorized") });

		//check if exist in blacklist
		const exist = await existTokenInBlacklist(authorization);
		if (exist) return res.status(401).json({ ok: false, msg: handleError("Please sign in.") });
		
		console.log('pasa por aqui')
		const payload = await validateSignature(authorization);
		req.user = payload;
		next();
	} catch (error) {
		res.status(401).json({ ok: false, msg: handleError(error) });
	}
};
