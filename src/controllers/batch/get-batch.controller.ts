// ============================================================
// 🔹GetBatchController — Controller to get a single batch by ID
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { getBatchService } from "@/services/batch.service";
import { successResponse } from "@/utils/index.util";
import type { BatchIDParams } from "@/validator/batch.validator";

// ------------------------------------------------------
// getBatchController() — Controller to get a single batch by ID
// ------------------------------------------------------
const getBatchController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract batchId from request parameters
	const batchId = req.params.batchId as BatchIDParams["batchId"];

	// Convert batchId to number
	const batchNumberId = Number(batchId);

	// Validate batchId
	if (!batchId) {
		// Log error if batchId is missing
		logger.error("Batch ID is missing in request parameters", {
			label: "GetBatchController",
		});

		// Return error if batchId is missing
		return next(
			new APIError(400, "Batch ID is required", {
				type: "BadRequest",
				details: [
					{
						field: "batchId",
						message: "Batch ID parameter is missing",
					},
				],
			}),
		);
	}

	// Fetch batch using the service
	const batch = await getBatchService(batchNumberId);

	// Handle case where batch is not found
	if (!batch) {
		// Log error if batch is not found
		logger.error(`Batch with ID ${batchNumberId} not found`, {
			label: "GetBatchController",
		});

		// Return error if batch is not found
		return next(
			new APIError(404, "Batch not found", {
				type: "NotFound",
				details: [
					{
						field: "batchId",
						message: `No batch found with ID ${batchNumberId}`,
					},
				],
			}),
		);
	}

	// Log success message
	logger.info(`Batch with ID ${batchNumberId} retrieved successfully`, {
		label: "GetBatchController",
	});

	// Send success response with batch data
	successResponse(res, 200, "Batch retrieved successfully", batch);
};

export default getBatchController;
