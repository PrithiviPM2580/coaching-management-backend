// ============================================================
// 🧩 JWTLib — JSON Web Token Library
// ============================================================
import jwt from "jsonwebtoken";
import config from "@/config/env.config";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";

// ------------------------------------------------------
// signToken() — Signs a JWT with a given payload, secret, and expiration
// ------------------------------------------------------
const signToken = <T extends object>(
	payload: T,
	secret: string,
	expiresIn: string | number,
): string => {
	// Log token generation attempt
	return jwt.sign(payload, secret, {
		expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
	});
};

// ------------------------------------------------------
// verifyToken() — Verifies a JWT with a given token and secret
// ------------------------------------------------------
const verifyToken = <T extends object>(token: string, secret: string): T => {
	try {
		// Log token verification attempt
		return jwt.verify(token, secret) as T;
	} catch (error) {
		// Log token verification failure
		logger.error("Token verification failed:", {
			label: "JWT_LIB",
			error: (error as Error).message,
		});

		// Throw an APIError for invalid or expired tokens
		throw new APIError(401, "Invalid or expired token", {
			type: "TokenError",
			details: [
				{
					field: "token",
					message: "The provided token is invalid or has expired.",
				},
			],
		});
	}
};

// ------------------------------------------------------
// jwtUtil{} — JWT Utility Functions
// ------------------------------------------------------
const jwtutil = {
	// Generate Access Token
	generateAccessToken(payload: TokenPayload) {
		return signToken(
			payload, // payload
			config.JWT_ACCESS_TOKEN_SECRET, // jwt secret
			config.JWT_ACCESS_TOKEN_EXPIRATION, // expiration time
		);
	},

	// Generate Refresh Token
	generateRefreshToken(payload: TokenPayload) {
		return signToken(
			payload, // payload
			config.JWT_REFRESH_TOKEN_SECRET, // jwt secret
			config.JWT_REFRESH_TOKEN_EXPIRATION, // expiration time
		);
	},

	// Verify Access Token
	verifyAccessToken(token: string) {
		return verifyToken<TokenPayload>(token, config.JWT_ACCESS_TOKEN_SECRET);
	},
	// Verify Refresh Token
	verifyRefreshToken(token: string) {
		return verifyToken<TokenPayload>(token, config.JWT_REFRESH_TOKEN_SECRET);
	},
};

export default jwtutil;
