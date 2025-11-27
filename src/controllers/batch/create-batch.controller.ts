// ============================================================
// 🔹CreateBatchRoute — Controller for creating a new batch
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { createBatchService } from "@/services/batch.service";
import { successResponse } from "@/utils/index.util";
import type { CreateBatchBody } from "@/validator/batch.validator";

// ------------------------------------------------------
// createBatchController() — Controller to handle creating a new batch
// ------------------------------------------------------
const createBatchController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Call the service to create a new batch
	const newBatch = await createBatchService(req.body as CreateBatchBody);

	// If batch creation failed, log an error and pass an API error to the next middleware
	if (!newBatch) {
		// Log an error if batch creation failed
		logger.error("Failed to create new batch", {
			label: "CreateBatchController",
		});

		// Pass an API error to the next middleware
		return next(
			new APIError(500, "Failed to create new batch", {
				type: "InternalServerError",
				details: [
					{
						field: "body",
						message: "Batch creation failed due to server error",
					},
				],
			}),
		);
	}

	// Log success message
	logger.info("New batch created successfully", {
		label: "CreateBatchController",
		batch: newBatch,
	});

	// Send success response with the created batch data
	successResponse(res, 201, "Batch created successfully", newBatch);
};

export default createBatchController;
