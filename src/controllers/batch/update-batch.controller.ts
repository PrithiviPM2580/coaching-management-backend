// ============================================================
// 🔹UpdateBatchController — Controller to update a batch by ID
// ============================================================
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import type { BatchIDParams } from "@/validator/batch.validator";
import type { Request, Response, NextFunction } from "express";
import { updateBatchService } from "@/services/batch.service";
import { successResponse } from "@/utils/index.util";

// ------------------------------------------------------
// updateBatchController() — Controller to update a batch by ID
// ------------------------------------------------------
const updateBatchController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract batchId from request parameters
	const batchId = req.params.batchId as BatchIDParams["batchId"];

	//  Convert batchId to number
	const batchNumberId = Number(batchId);

	// Call the service to update the batch
	const updateData = await updateBatchService(batchNumberId, req.body);

	// Handle case where update fails
	if (!updateData) {
		// Log an error if update fails
		logger.error(`Failed to update batch with ID: ${batchId}`, {
			label: "UpdateBatchController",
		});

		// Pass an API error to the next middleware
		return next(
			new APIError(500, "Failed to update batch", {
				type: "InternalServerError",
				details: [
					{
						field: "batchId",
						message: `Batch with ID: ${batchId} could not be updated`,
					},
				],
			}),
		);
	}

	// Log a success message if update is successful
	logger.info(`Batch with ID: ${batchId} updated successfully`, {
		label: "UpdateBatchController",
	});

	// Send a success response with the updated batch data
	successResponse(res, 201, "Batch updated successfully", updateData);
};

export default updateBatchController;
