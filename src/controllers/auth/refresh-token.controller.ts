// ============================================================
// 🧩 RefreshTokenController — Handles refresh token related logic
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import cookie from "@/lib/cookie.lib";
import logger from "@/lib/logger.lib";
import { refreshTokenService } from "@/services/auth.service";
import { successResponse } from "@/utils/index.util";

// ------------------------------------------------------
// refreshTokenController() — Handles refresh token logic
// ------------------------------------------------------
const refreshTokenController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract refresh token from cookies
	const refreshToken = cookie.get(req, "refreshToken");

	// If no refresh token is found, return an authentication error
	if (!refreshToken) {
		// Log the missing refresh token
		logger.warn("No refresh token found in cookies", {
			label: "RefreshTokenController",
		});

		// Return an authentication error response
		return next(
			new APIError(401, "Authentication required: No refresh token provided", {
				type: "AuthenticationError",
				details: [
					{
						field: "refreshToken",
						message: "No refresh token found in cookies",
					},
				],
			}),
		);
	}

	// Call the refresh token service to get new tokens
	const { newAccessToken, newRefreshToken } =
		await refreshTokenService(refreshToken);

	// If token generation failed, return an error
	if (!newAccessToken || !newRefreshToken) {
		// Log the failure to refresh tokens
		logger.error("Failed to refresh tokens", {
			label: "RefreshTokenController",
		});

		// Return an error response
		return next(
			new APIError(500, "Failed to refresh tokens", {
				type: "TokenError",
				details: [
					{
						field: "refreshToken",
						message: "Could not generate new tokens",
					},
				],
			}),
		);
	}

	// Set the new refresh token in cookies
	cookie.set(res, "refreshToken", newRefreshToken);

	// Log the successful token refresh
	logger.info("Refresh token rotated and new access token issued", {
		label: "RefreshTokenController",
	});

	// Send success response with the new access token
	successResponse(res, 201, "Tokens refreshed successfully", {
		accessToken: newAccessToken,
	});
};

export default refreshTokenController;
