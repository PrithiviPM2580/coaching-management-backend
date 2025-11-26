// ============================================================
// 🧩 AsyncHandlerMiddleware — Middleware to handle async errors
// ============================================================
import type { NextFunction, Request, Response } from "express";

// ------------------------------------------------------
// asyncHandlerMiddleware() — Middleware to handle async errors
// ------------------------------------------------------
const asyncHandlerMiddleware =
	(
		controller: (
			req: Request,
			res: Response,
			next: NextFunction,
		) => Promise<void>,
	) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller(req, res, next);
		} catch (error) {
			next(error);
		}
	};

export default asyncHandlerMiddleware;
