// ============================================================
// 🧩 ValidateLib — Validation library and configurations
// ============================================================

import type Joi from "joi";
import APIError from "@/lib/api-error.lib";

// ------------------------------------------------------
// validate() — Validates a configuration object against a Joi schema
// ------------------------------------------------------
const validate = <T>(schema: Joi.ObjectSchema<T>, config: unknown) => {
	// Validate the config object against the schema
	const { error, value } = schema.validate(config, {
		abortEarly: false,
		allowUnknown: true,
		stripUnknown: true,
	});

	// If there is a validation error, throw an error with the details
	if (error) {
		throw new APIError(500, "Configuration validation error", {
			type: "ValidationError",
			details: error.details.map((detail) => ({
				field: detail.path.join("."),
				message: detail.message,
			})),
		});
	}

	// Return the validated and sanitized configuration object
	return value as T;
};

export default validate;
