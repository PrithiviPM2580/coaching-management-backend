// ============================================================
// 🔹BatchService — Business logic for batch operations
// ============================================================

import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import type { CreateBatchBody } from "@/validator/batch.validator";
import {
	createBatchRepository,
	getAllBatchesRepository,
} from "@/repositories/batch.repository";

// ------------------------------------------------------
// createBatchService() — Service to handle creating a new batch
// ------------------------------------------------------
export const createBatchService = async (batchData: CreateBatchBody) => {
	// Validate input data
	if (!batchData) {
		// Log an error if no batch data is provided
		logger.error("No batch data provided", {
			label: "BatchService",
		});

		// Throw an API error for bad request
		throw new APIError(400, "Batch data is required to create a new batch", {
			type: "BadRequest",
			details: [
				{
					field: "body",
					message: "Batch data is missing",
				},
			],
		});
	}

	// Create the new batch using the repository
	const newBatch = await createBatchRepository(batchData);

	// Return the newly created batch
	return newBatch;
};

// ------------------------------------------------------
// getAllBatchesService() — Service to handle fetching all batches
// ------------------------------------------------------
export const getAllBatchesService = async () => {
	// Fetch all batches using the repository
	const batches = await getAllBatchesRepository();

	// Return the list of batches
	return batches;
};
