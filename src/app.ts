// ============================================================
// 🧩 APP — Express application setup
// ============================================================

import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import logger from "@/lib/logger.lib";

// Initialize the Express application
const app: Express = express();

import globalErrorHandlerMiddleware from "@/middleware/global-error-handler.middleware";
// ------------------------------------------------------
// Imports
// ------------------------------------------------------
import routes from "@/routes/index.route";

// ------------------------------------------------------
// Middlewares
// ------------------------------------------------------
app.use(helmet());
app.use(
	morgan("combined", {
		stream: { write: (message) => logger.info(message.trim()) },
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(routes);
app.use(globalErrorHandlerMiddleware);

export default app;
