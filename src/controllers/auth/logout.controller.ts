// ============================================================
// 🧩 LogoutController — Handles user logout functionality
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import cookie from "@/lib/cookie.lib";
import jwtutil from "@/lib/jwt.lib";
import logger from "@/lib/logger.lib";
import { logoutService } from "@/services/auth.service";
import { successResponse } from "@/utils/index.util";

// ------------------------------------------------------
// logoutController() — Handles user logout functionality
// ------------------------------------------------------
const logoutController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Retrieve the refresh token from cookies
	const refreshToken = cookie.get(req, "refreshToken");

	// Handle missing refresh token
	if (!refreshToken) {
		// Log warning for missing refresh token
		logger.warn("No refresh token found in cookies during logout", {
			label: "LogoutController",
		});

		// Return error response for missing refresh token
		return next(
			new APIError(400, "No refresh token found", {
				type: "InvalidRequest",
				details: [
					{
						field: "refreshToken",
						message: "Refresh token is required for logout",
					},
				],
			}),
		);
	}

	// Verify the refresh token to extract payload
	const payload = jwtutil.verifyRefreshToken(refreshToken);

	// Log the logout attempt
	logger.info(`User ${payload.studentId} logged out successfully`, {
		label: "LogoutController",
	});

	// Call the logout service to handle logout logic
	const isLogout = await logoutService(refreshToken);

	// Handle logout failure
	if (!isLogout) {
		// Log the error for logout failure
		logger.error("Logout service failed", { label: "LogoutController" });

		// Return error response for logout failure
		return next(
			new APIError(500, "Logout failed", {
				type: "ServerError",
			}),
		);
	}

	// Clear the refresh token cookie
	cookie.clear(res, "refreshToken");

	// Log successful logout
	logger.info(`Intern ID: ${payload.studentId} logged out successfully`, {
		label: "LogoutController",
	});

	// Send success response
	successResponse(res, 200, "Logout successful");
};

export default logoutController;
