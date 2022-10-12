import { handleError, validateSignature } from "../../utils/index";
import { Response, NextFunction, Request } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		await validateSignature(req);
		return next();
	} catch (error) {
		return res.status(401).json({ ok: false, msg: handleError(error) });
	}
};
