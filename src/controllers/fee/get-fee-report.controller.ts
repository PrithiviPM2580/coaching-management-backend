// ============================================================
// 🔹GetFeeReportsController — Controller to handle fetching fee reports
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { getFeeReportsService } from "@/services/fee.service";
import { successResponse } from "@/utils/index.util";
import type { FeesReportQuery } from "@/validator/fee.validator";

// ------------------------------------------------------
// getFeeReportsController() — Controller to handle fetching fee reports
// ------------------------------------------------------
const getFeeReportsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract query parameters
	const { type, date } = req.query as unknown as FeesReportQuery;

	// Validate required parameters
	if (!type || !date) {
		// Log the missing parameters error
		logger.error(
			"Missing required query parameters 'type' or 'date' in getFeeReportsController",
			{
				label: "GetFeeReportsController",
			},
		);
		// Pass an APIError to the next middleware
		return next(
			new APIError(400, "Missing required query parameters 'type' or 'date'", {
				type: "BadRequest",
				details: [
					{
						field: "type/date",
						message: "Both 'type' and 'date' query parameters are required.",
					},
				],
			}),
		);
	}

	// Call the service to get fee reports
	const { start, end, totalCollected, breakDown } = await getFeeReportsService(
		type,
		date,
	);

	// Validate service response
	if (!start || !end) {
		// Log the error for missing start or end dates
		logger.error(
			"Failed to compute start or end date in getFeeReportsController",
			{
				label: "GetFeeReportsController",
			},
		);

		// Pass an APIError to the next middleware
		return next(
			new APIError(500, "Failed to compute start or end date", {
				type: "InternalServerError",
				details: [
					{
						field: "date",
						message:
							"Failed to compute start or end date based on the provided input.",
					},
				],
			}),
		);
	}

	// Validate breakdown and total collected
	if (!breakDown || totalCollected) {
		// Log the error for missing breakdown or total collected
		logger.error(
			"Failed to retrieve breakdown or total collected in getFeeReportsController",
			{
				label: "GetFeeReportsController",
			},
		);

		// Pass an APIError to the next middleware
		return next(
			new APIError(500, "Failed to retrieve breakdown or total collected", {
				type: "InternalServerError",
				details: [
					{
						field: "breakDown/totalCollected",
						message:
							"Failed to retrieve breakdown or total collected based on the provided input.",
					},
				],
			}),
		);
	}

	// Log successful report generation
	logger.info("Fee report generated successfully", {
		label: "GetFeeReportsController",
		start,
		end,
		totalCollected,
		breakDown,
	});

	// Send success response with the report data
	successResponse(res, 200, "Fee report generated successfully", {
		report: {
			start,
			end,
			totalCollected,
			breakDown,
		},
	});
};

export default getFeeReportsController;
