// ============================================================
// 🧩 GlobalErrorHandlerMiddleware — Middleware to handle global errors
// ============================================================
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";

const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jwt;

// ------------------------------------------------------
// GlobalErrorHandlerMiddleware() — Middleware to handle global errors
// ------------------------------------------------------

const globalErrorHandlerMiddleware = (
	err: Error,
	_req: Request,
	res: Response,
	next: NextFunction,
): void => {
	void next;

	// Initialize a variable to hold the custom APIError
	let customError: APIError;

	// Handle specific JWT errors
	if (err instanceof JsonWebTokenError) {
		// Log the JWT error details
		logger.error("JWT Error occurred", {
			label: "GlobalErrorHandlerMiddleware",
			error: err.message,
		});

		// Create a new APIError for JWT errors
		customError = new APIError(
			401,
			"Authentication failed. Invalid token provided.",
			{
				type: "JsonWebTokenError",
				details: [
					{
						field: "token",
						message: err.message,
					},
				],
			},
		);
	} else if (err instanceof TokenExpiredError) {
		// Log the token expiration details
		logger.error("JWT Token Expired", {
			label: "GlobalErrorHandlerMiddleware",
			error: err.message,
		});

		// Create a new APIError for token expiration
		customError = new APIError(
			401,
			"Authentication failed. Token has expired.",
			{
				type: "TokenExpiredError",
				details: [
					{
						field: "token",
						message: err.message,
					},
				],
			},
		);
	} else if (err instanceof NotBeforeError) {
		// Log the not before error details
		logger.error("JWT Not Before Error", {
			label: "GlobalErrorHandlerMiddleware",
			error: err.message,
		});

		// Create a new APIError for not before errors
		customError = new APIError(
			401,
			"Authentication failed. Token not active yet.",
			{
				type: "NotBeforeError",
				details: [
					{
						field: "token",
						message: err.message,
					},
				],
			},
		);
	} else if (err instanceof APIError) {
		// Log the API error details
		logger.error("API Error occurred", {
			label: "GlobalErrorHandlerMiddleware",
			error: err.message,
		});

		// Use the existing APIError
		customError = err;
	} else {
		// Log unknown error details
		const unknownError = err as Error;
		logger.error("Unknown Error occurred", {
			label: "GlobalErrorHandlerMiddleware",
			error: unknownError.message,
		});

		// Create a generic APIError for unknown errors
		customError = new APIError(
			500,
			unknownError.message || "Internal Server Error",
			undefined,
			unknownError.stack,
		);
	}

	// Send the error response to the client
	res.status(customError.statusCode).json({
		success: customError.success,
		statusCode: customError.statusCode,
		message: customError.message,
		error: customError.error,
	});
};

export default globalErrorHandlerMiddleware;
