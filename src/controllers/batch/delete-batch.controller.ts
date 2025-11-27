// ============================================================
// 🔹DeleteBatchController — Controller to delete a batch by ID
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { deleteBatchService } from "@/services/batch.service";
import { successResponse } from "@/utils/index.util";
import type { BatchIDParams } from "@/validator/batch.validator";

// ------------------------------------------------------
// deleteBatchController() — Controller to delete a batch by ID
// ------------------------------------------------------
const deleteBatchController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract batch ID from request parameters
	const batchId = req.params.batchId as BatchIDParams["batchId"];

	// Convert batch ID to number
	const batchNumberId = Number(batchId);

	// Validate batch ID
	if (!batchId) {
		// Log an error if batch ID is missing
		logger.error(`Batch ID is missing in the request parameters.`, {
			label: "DeleteBatchController",
		});

		// Pass an API error to the next middleware
		return next(
			new APIError(400, "Batch ID is required", {
				type: "MissingParameter",
				details: [
					{
						field: "batchId",
						message: "Batch ID parameter is missing",
					},
				],
			}),
		);
	}

	// Call the service to delete the batch
	const batch = await deleteBatchService(batchNumberId);

	// Log successful deletion
	logger.info(`Batch with ID ${batchId} deleted successfully.`, {
		label: "DeleteBatchController",
	});

	// Send success response
	successResponse(res, 200, "Batch deleted successfully", { batch });
};

export default deleteBatchController;
