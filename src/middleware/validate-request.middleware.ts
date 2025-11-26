// ============================================================
// 🧩 ValidateRequestMiddleware — Middleware to validate request bodies
// ============================================================

import type { NextFunction, Request, Response } from "express";
import type Joi from "joi";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";

// ------------------------------------------------------
// validatePart() — Validates a specific part of the request (body, params, or query) against a Joi schema
// ------------------------------------------------------
const validatePart = (
	part: "body" | "params" | "query",
	schema: Joi.ObjectSchema | undefined,
	req: Request,
	next: NextFunction,
): boolean => {
	// If no schema is provided, skip validation
	if (!schema) return true;

	// Perform the validation
	const { error, value } = schema.validate(req[part], {
		abortEarly: false,
		stripUnknown: true,
	});

	// Handle validation errors
	if (error) {
		// Log the validation error
		logger.error(`Validation error in request ${part}: ${error.message}`, {
			label: "ValidateRequestMiddleware",
		});

		// Pass a detailed APIError to the next middleware
		next(
			new APIError(400, "Validation Error", {
				type: "ValidationError",
				details: error.details.map((detail) => ({
					field: detail.path.join("."),
					message: detail.message,
				})),
			}),
		);

		// Indicate that validation failed
		return false;
	}
	// Update the request part with the validated and sanitized value
	req[part] = value;

	// Indicate that validation succeeded
	return true;
};

// ------------------------------------------------------
// validateRequestMiddleware() — Middleware to validate the entire request against provided Joi schemas
// ------------------------------------------------------
const validateRequestMiddleware =
	(schema: RequestValidate) =>
	(req: Request, _res: Response, next: NextFunction) => {
		try {
			// Validate each part of the request
			if (!validatePart("body", schema.body, req, next)) return;
			if (!validatePart("query", schema.query, req, next)) return;
			if (!validatePart("params", schema.params, req, next)) return;

			// Proceed to the next middleware if all validations pass
			next();
		} catch (error) {
			// Log unexpected errors
			logger.error("Unexpected error in Joi validation middleware", {
				label: "ValidateRequestMiddleware",
				error,
			});
			// Pass a generic APIError to the next middleware
			next(error);
		}
	};

export default validateRequestMiddleware;
