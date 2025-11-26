// ============================================================
// 🧩 LoggerLib — Logging liberary and configurations
// ============================================================

import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import winston from "winston";
import config from "@/config/env.config";

// ------------------------------------------------------
// LogOptions interface for logger
// ------------------------------------------------------
interface LogOptions extends winston.Logform.TransformableInfo {
	label?: string;
	message: string;
}

// Logger format components
const { combine, timestamp, printf } = winston.format;

// Logger transports array
const transports: winston.transport[] = [];

// Log directory path and create if it doesn't exist
const logDir = path.join(process.cwd(), "logs");
if (config.NODE_ENV === "production" && !fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

// ------------------------------------------------------
// Logger custom format
// ------------------------------------------------------
const customFormat = combine(
	//  Add timestamp to log entries
	timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

	// Custom log message format
	printf((info) => {
		// Destructure log info
		const { timestamp, level, message, label, ...meta } = info as LogOptions;

		// Use default label if none provided
		const labelStr = label ? label : "App";

		// Clean meta to include only string keys
		const cleanMeta = Object.fromEntries(
			Object.entries(meta).filter(([key]) => typeof key === "string"),
		);

		// Stringify meta if it has content
		const metaStr = Object.keys(cleanMeta).length
			? `\n${JSON.stringify(cleanMeta, null, 2)}`
			: "";

		// Color-coded log output
		switch (level) {
			case "info":
				return `🟢 ${chalk.gray(timestamp)} [${chalk.green(
					level.toUpperCase(),
				)}] [${chalk.cyanBright("APP")}: ${chalk.green(
					labelStr,
				)}]: ${chalk.greenBright(message)} ${chalk.greenBright(metaStr)}`;
			case "error":
				return `🔴 ${chalk.gray(timestamp)} [${chalk.red(
					level.toUpperCase(),
				)}] [${chalk.cyanBright("APP")}: ${chalk.red(
					labelStr,
				)}]: ${chalk.redBright(message)} ${chalk.redBright(metaStr)}`;
			case "warn":
				return `🟡 ${chalk.gray(timestamp)} [${chalk.yellow(
					level.toUpperCase(),
				)}] [${chalk.cyanBright("APP")}: ${chalk.yellow(
					labelStr,
				)}]: ${chalk.yellowBright(message)} ${chalk.yellowBright(metaStr)}`;
			default:
				return `${chalk.gray(timestamp)} [${chalk.green(
					level.toUpperCase(),
				)}] [${chalk.cyanBright("APP")}: ${chalk.green(
					labelStr,
				)}]: ${chalk.greenBright(message)} ${chalk.greenBright(metaStr)}`;
		}
	}),
);

// ------------------------------------------------------
//  Configure transports based on environment
// ------------------------------------------------------
if (config.NODE_ENV !== "production" && config.NODE_ENV !== "test") {
	// Console transport for non-production environments
	transports.push(
		new winston.transports.Console({
			format: customFormat,
			level: config.LOG_LEVEL,
		}),
	);
} else {
	// File transports for production environment
	transports.push(
		new winston.transports.File({
			filename: path.join(logDir, "app.log"),
			level: "info",
		}),
	);

	// Error log file transport for production environment
	transports.push(
		new winston.transports.File({
			filename: path.join(logDir, "error.log"),
			level: "error",
		}),
	);

	// Combined log file transport for production environment
	transports.push(
		new winston.transports.File({
			filename: path.join(logDir, "combined.log"),
		}),
	);
}

// ------------------------------------------------------
// Create and export the logger instance
// ------------------------------------------------------
const logger = winston.createLogger({
	level: config.LOG_LEVEL,
	format: customFormat,
	transports,
	silent: config.NODE_ENV === "test",
});

export default logger;
