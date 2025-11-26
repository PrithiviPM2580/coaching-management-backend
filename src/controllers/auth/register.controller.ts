// ============================================================
// 🧩 RegsiterContoller — Handles user registration logic
// ============================================================
import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import cookie from "@/lib/cookie.lib";
import logger from "@/lib/logger.lib";
import { registerService } from "@/services/auth.service";
import { successResponse } from "@/utils/index.util";
import type { RegisterBody } from "@/validator/auth.validator";

// ------------------------------------------------------
// registerController() — Handles user registration requests
// ------------------------------------------------------
const registerController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Call the register service with the request body
	const { user, accessToken, refreshToken } = await registerService(
		req.body as RegisterBody,
	);

	// Validate the returned data
	if (!user) {
		// Log the error if user registration failed
		logger.error("Registration failed: User not created.", {
			label: "RegisterController",
		});

		// Throw an API error if user registration failed
		return next(
			new APIError(500, "Registration failed", {
				type: "InternalServerError",
				details: [
					{
						field: "user",
						message: "User registration failed due to server error.",
					},
				],
			}),
		);
	}

	// Validate the tokens
	if (!accessToken || !refreshToken) {
		// Log the error if token generation failed
		logger.error("Registration failed: Tokens not generated.", {
			label: "RegisterController",
		});

		// Throw an API error if token generation failed
		return next(
			new APIError(500, "Registration failed", {
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

	// Set the refresh token in cookies
	cookie.set(res, "refreshToken", refreshToken);

	// Send a success response with the user data and access token
	successResponse(res, 201, "Registration successful", {
		user,
		accessToken,
	});
};

export default registerController;
