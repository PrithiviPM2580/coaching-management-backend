// ============================================================
// 🧩 LoginController — Handles user login functionality
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import cookie from "@/lib/cookie.lib";
import logger from "@/lib/logger.lib";
import { loginService } from "@/services/auth.service";
import { successResponse } from "@/utils/index.util";
import type { LoginBody } from "@/validator/auth.validator";

// ------------------------------------------------------
// loginController() — Handles user login functionality
// ------------------------------------------------------
const loginController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Call the login service with the request body
	const { user, accessToken, refreshToken } = await loginService(
		req.body as LoginBody,
	);

	// Validate the returned data
	if (!user) {
		// Log the error if user data is not returned
		logger.error("Login failed: User data not returned from service.", {
			label: "LoginController",
		});

		// Throw an API error if user data is not returned
		return next(
			new APIError(500, "Login failed", {
				type: "InternalServerError",
				details: [
					{
						field: "user",
						message: "User data not returned from service.",
					},
				],
			}),
		);
	}

	// Validate the tokens
	if (!accessToken || !refreshToken) {
		// Log the error if tokens are not returned
		logger.error("Login failed: Tokens not generated.", {
			label: "LoginController",
		});

		// Throw an API error if tokens are not returned
		return next(
			new APIError(500, "Login failed", {
				type: "InternalServerError",
				details: [
					{
						field: "tokens",
						message: "Token generation failed due to server error.",
					},
				],
			}),
		);
	}

	// Set the refresh token in an HTTP-only cookie
	cookie.set(res, "refreshToken", refreshToken);

	// Log the successful login
	logger.info(`Login successful for user ID ${user.id}.`, {
		label: "LoginController",
	});

	// Send a success response with the user data and access token
	successResponse(res, 200, "Login successful", {
		user,
		accessToken,
	});
};

export default loginController;
