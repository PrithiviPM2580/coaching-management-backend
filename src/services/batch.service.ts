// ============================================================
// 🔹BatchService — Business logic for batch operations
// ============================================================

import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import {
	createBatchRepository,
	getAllBatchesRepository,
	getBatchByIdRepository,
	updateBatchByIdRepository,
	deleteBatchByIdRepository,
} from "@/repositories/batch.repository";
import type {
	CreateBatchBody,
	UpdateBatchBody,
} from "@/validator/batch.validator";

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

// ------------------------------------------------------
// getBatchService() — Service to handle fetching a single batch by ID
// ------------------------------------------------------
export const getBatchService = async (batchId: number) => {
	// Validate the batch ID
	if (!batchId) {
		// Log an error if batch ID is not provided
		logger.error("Batch ID is required to fetch batch", {
			label: "BatchService",
		});

		// Throw an API error for bad request
		throw new APIError(400, "Batch ID is required", {
			type: "BadRequest",
			details: [
				{
					field: "batchId",
					message: "Batch ID is missing",
				},
			],
		});
	}

	// Fetch the batch by ID using the repository
	const batch = await getBatchByIdRepository(batchId);

	// If no batch is found, throw a not found error
	return batch;
};

// ------------------------------------------------------
// updateBatchService() — Service to handle updating a batch by ID
// ------------------------------------------------------
export const updateBatchService = async (
	batchId: number,
	updateData: UpdateBatchBody,
) => {
	// Validate the batch ID and update data
	if (!batchId) {
		// Log an error if batch ID is not provided
		logger.error("Batch ID is required to update batch", {
			label: "BatchService",
		});

		// Throw an API error for bad request
		throw new APIError(400, "Batch ID is required", {
			type: "BadRequest",
			details: [
				{
					field: "batchId",
					message: "Batch ID is missing",
				},
			],
		});
	}

	// Validate update data
	if (!updateData) {
		logger.error("No update data provided", {
			label: "BatchService",
		});

		throw new APIError(400, "Update data is required to update batch", {
			type: "BadRequest",
			details: [
				{
					field: "body",
					message: "Update data is missing",
				},
			],
		});
	}

	// Update the batch using the repository
	const updatedBatch = await updateBatchByIdRepository(batchId, updateData);

	// Return the updated batch
	return updatedBatch;
};

// ------------------------------------------------------
// deleteBatchService() — Service to handle deleting a batch by ID
// ------------------------------------------------------
export const deleteBatchService = async (batchId: number): Promise<boolean> => {
	//
	if (!batchId) {
		// Log an error if batch ID is not provided
		logger.error("Batch ID is required to delete batch", {
			label: "BatchService",
		});

		// Throw an API error for bad request
		throw new APIError(400, "Batch ID is required", {
			type: "BadRequest",
			details: [
				{
					field: "batchId",
					message: "Batch ID is missing",
				},
			],
		});
	}

	// Delete the batch using the repository
	await deleteBatchByIdRepository(batchId);

	// Return true indicating successful deletion
	return true;
};
