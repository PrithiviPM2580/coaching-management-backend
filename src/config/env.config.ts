// ============================================================
// 🧩 EnvConfig — Environment configuration
// ============================================================
import "dotenv/config";
import validate from "@/lib/validate.lib";
import envSchema from "@/validator/env.validator";

// ------------------------------------------------------
// envConfig{} — Environment configuration object
// ------------------------------------------------------
const envConfig = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	APP_VERSION: process.env.APP_VERSION,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DATABASE_URL: process.env.DATABASE_URL,
	LOG_LEVEL: process.env.LOG_LEVEL,
	JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
	JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
	JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
	JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
	ADMIN_USER_EMAIL: process.env.ADMIN_USER_EMAIL,
};

// Configure and validate the environment variables
const config = validate(envSchema, envConfig);

export default config;
