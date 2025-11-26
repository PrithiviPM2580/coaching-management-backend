// ============================================================
// 🧩 AuthenticateMiddleware — Middleware to authenticate users
// ============================================================
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import APIError from "@/lib/api-error.lib";
import jwtutil from "@/lib/jwt.lib";
import logger from "@/lib/logger.lib";

// JWT Error classes
const { TokenExpiredError, JsonWebTokenError } = jwt;

// ------------------------------------------------------
// authenticateMiddleware() — Middleware to authenticate users
// ------------------------------------------------------
const authenticateMiddleware =
	(allowRoles: Role[] = []) =>
	(req: Request, _res: Response, next: NextFunction) => {
		// Extract the Authorization header
		const { authorization } = req.headers;

		// Check if the Authorization header is present
		if (!authorization) {
			// Log the missing header
			logger.warn("Authentication failed: No authorization header", {
				label: "AuthenticateMiddleware",
			});

			// Pass an error to the next middleware
			next(
				new APIError(401, "Authentication failed: No authorization header", {
					type: "AuthenticationError",
					details: [
						{
							field: "authorization",
							message: "No authorization header provided",
						},
					],
				}),
			);
		}

		// Split the header to get the token
		const [schema, token] = authorization?.split(" ") || [];

		// Validate the schema and token
		if (!token || schema !== "Bearer") {
			/// Log the invalid header
			logger.warn("Authentication failed: Invalid authorization header", {
				label: "AuthenticateMiddleware",
			});

			// Pass an error to the next middleware
			next(
				new APIError(
					401,
					"Authentication failed: Invalid authorization header",
					{
						type: "AuthenticationError",
						details: [
							{
								field: "authorization",
								message: "Invalid authorization header format",
							},
						],
					},
				),
			);
		}

		try {
			// Verify the token and extract the payload
			const payload = jwtutil.verifyAccessToken(token) as TokenPayload;

			// Verify the token and extract the payload
			if (!payload) {
				// Log the invalid payload
				logger.error("Authentication failed: Invalid token payload", {
					label: "AuthenticateMiddleware",
				});

				// Pass an error to the next middleware
				next(
					new APIError(401, "Authentication failed: Invalid token payload", {
						type: "AuthenticationError",
						details: [
							{
								field: "token",
								message: "Invalid token payload",
							},
						],
					}),
				);
			}

			// Check for required fields in the payload
			if (!payload.role || !payload.studentId) {
				// Log the incomplete payload
				logger.error("Authentication failed: Incomplete token payload", {
					label: "AuthenticateMiddleware",
				});

				// Pass an error to the next middleware
				next(
					new APIError(401, "Authentication failed: Incomplete token payload", {
						type: "AuthenticationError",
						details: [
							{
								field: "token",
								message: "Incomplete token payload",
							},
						],
					}),
				);
			}

			// Attach the student info to the request object
			req.student = {
				studentId: payload.studentId,
				role: payload.role,
			};

			// Check if the user's role is allowed
			if (allowRoles.length > 0 && !allowRoles.includes(payload.role)) {
				// Log the insufficient permissions
				logger.error("Authorization failed: Insufficient permissions", {
					label: "AuthenticateMiddleware",
				});

				// Pass an error to the next middleware
				next(
					new APIError(403, "Authorization failed: Insufficient permissions", {
						type: "AuthorizationError",
						details: [
							{
								field: "role",
								message: "Insufficient permissions",
							},
						],
					}),
				);
			}

			// Proceed to the next middleware
			next();
		} catch (error) {
			// Handle JWT errors
			if (error instanceof TokenExpiredError) {
				logger.error("AccessToken has expired");
				return next(
					new APIError(401, "Unauthorized - AccessToken has expired"),
				);
			}

			// Handle invalid token errors
			if (error instanceof JsonWebTokenError) {
				logger.error("Invalid AccessToken");
				return next(new APIError(401, "Unauthorized - Invalid AccessToken"));
			}

			// Log unexpected errors
			logger.error("Error occurred while verifying AccessToken", {
				label: "AuthenticateMiddleware",
				error: error as Error,
			});

			// Pass an error to the next middleware
			return next(
				new APIError(500, "Internal Server Error", {
					type: "InternalServerError",
					details: [
						{
							field: "token",
							message: "Error occurred while verifying AccessToken",
						},
					],
				}),
			);
		}
	};

export default authenticateMiddleware;
