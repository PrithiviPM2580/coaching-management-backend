// ============================================================
// 🧩 EnvValidator — Environment variable validation
// ============================================================
import Joi from "joi";

// ------------------------------------------------------
// Env schema interface
// ------------------------------------------------------
export interface EnvSchema {
	NODE_ENV: "development" | "production" | "test";
	PORT: number;
	APP_VERSION: string;
	DB_HOST: string;
	DB_PORT: number;
	DB_USER: string;
	DB_PASSWORD: string;
	DB_NAME: string;
	DATABASE_URL: string;
	LOG_LEVEL: "error" | "warn" | "info";
	JWT_ACCESS_TOKEN_SECRET: string;
	JWT_ACCESS_TOKEN_EXPIRATION: string;
	JWT_REFRESH_TOKEN_SECRET: string;
	JWT_REFRESH_TOKEN_EXPIRATION: string;
	ADMIN_USER_EMAIL: string;
}

// ------------------------------------------------------
// envSchema{} — Environment variable schema
// ------------------------------------------------------
const envSchema = Joi.object<EnvSchema>({
	NODE_ENV: Joi.string().valid("development", "production", "test").required(),
	PORT: Joi.number().default(3000),
	APP_VERSION: Joi.string().default("1.0.0"),
	DB_HOST: Joi.string().hostname().required(),
	DB_PORT: Joi.number().default(3306),
	DB_USER: Joi.string().required(),
	DB_PASSWORD: Joi.string().allow("").required(),
	DB_NAME: Joi.string().required(),
	DATABASE_URL: Joi.string().uri().required(),
	LOG_LEVEL: Joi.string().valid("error", "warn", "info").default("info"),
	JWT_ACCESS_TOKEN_SECRET: Joi.string().min(20).required(),
	JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().default("15m"),
	JWT_REFRESH_TOKEN_SECRET: Joi.string().min(20).required(),
	JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().default("7d"),
	ADMIN_USER_EMAIL: Joi.string()
		.default("")
		.custom((value, helpers) => {
			// Ensure value is a string
			if (typeof value !== "string") {
				return helpers.error("any.invalid");
			}
			const emails = value
				.split(",")
				.map((email) => email.trim().toLowerCase())
				.filter((email) => email.length > 0);

			return emails;
		}, "Transform comma-separated admin emails"),
});

export default envSchema;
