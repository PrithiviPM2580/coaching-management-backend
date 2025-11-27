// ============================================================
// 🧩 IndexRoute —
// ============================================================
import { type Request, type Response, Router } from "express";
import config from "@/config/env.config";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import authRoute from "@/routes/auth.route";
import studentRoute from "@/routes/student.route";
import { successResponse } from "@/utils/index.util";

// Initialize the router
const router: Router = Router();

// ------------------------------------------------------
// Root Route
// ------------------------------------------------------
// @desc    Root Route
// @route   GET /
// @access  Public
router.route("/").get((_req: Request, res: Response) => {
	try {
		// Send a success response with application info
		successResponse(res, 200, "Welcome to the Tuition Coaching Backend API!", {
			appName: "Tuition Coaching Backend API", //  app name
			status: "running", // application status
			timestamp: new Date().toISOString(), // current timestamp
			version: config.APP_VERSION, // application version
			env: config.NODE_ENV, // current environment
		});
	} catch (error) {
		// Log the error
		logger.error("Error in IndexRoute GET /:", {
			label: "IndexRoute",
			error: error instanceof Error ? error.message : String(error),
		});

		// Throw a generic API error
		throw new APIError(500, "Internal Server Error", {
			type: "InternalServerError",
			details: [
				{
					field: "server",
					message: "An unexpected error occurred on the server.",
				},
			],
		});
	}
});

// ------------------------------------------------------
// Health Check
// ------------------------------------------------------
// @desc    Health Check Route
// @route   GET /health
// @access  Public
router.route("/health").get((_req: Request, res: Response) => {
	try {
		// Send a success response indicating the service is healthy
		successResponse(res, 200, "Health Check Successful", {
			status: "ok", // health status
			service: "Tuition Coaching Backend API", // service name
			database: "connected", // database status
			uptime: process.uptime(), // system uptime
			memoryUsage: `${process.memoryUsage().heapUsed / 1024 / 1024} MB`, // memory usage
			timestamp: new Date().toISOString(), // current timestamp
		});
	} catch (error) {
		// Log the error
		logger.error("Error in IndexRoute GET /health:", {
			label: "IndexRoute",
			error: error instanceof Error ? error.message : String(error),
		});

		// Throw a generic API error
		throw new APIError(500, "Internal Server Error", {
			type: "InternalServerError",
			details: [
				{
					field: "server",
					message: "An unexpected error occurred on the server.",
				},
			],
		});
	}
});

// ------------------------------------------------------
// Index Routes
// ------------------------------------------------------
router.use("/api/v1/auth", authRoute);
router.use("/api/v1/students", studentRoute);

// ------------------------------------------------------
// Not Found
// ------------------------------------------------------
// @desc    Not Found Route
// @route   ALL *
// @access  Public
router.use((req: Request, _res: Response) => {
	// Log the 404 error
	logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`, {
		label: "IndexRoute",
	});

	// Throw a 404 API error
	throw new APIError(404, "Not Found", {
		type: "NotFoundError",
		details: [
			{
				field: "url",
				message: `The requested URL ${req.originalUrl} was not found on this server.`,
			},
		],
	});
});

export default router;
