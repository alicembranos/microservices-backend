import AuthRequest from "../../interfaces/request.interface";
import { validateSignature } from "../../utils/index";
import { Response, NextFunction } from "express";

export default async (req: AuthRequest, res: Response, next: NextFunction) => {
	const isAuthorized = await validateSignature(req);
	if (isAuthorized) {
		return next();
	}
	return res.status(401).json({ ok: false, msg: "Not authorized" });
};
