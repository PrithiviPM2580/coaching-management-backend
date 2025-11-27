// ============================================================
// 🔹GetAllBatchesController — Controller to handle fetching all batches
// ============================================================
import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { getAllBatchesService } from "@/services/batch.service";
import { successResponse } from "@/utils/index.util";

// ------------------------------------------------------
// getAllBatchesController() — Fetch and return all batches
// ------------------------------------------------------
const getAllBatchesController = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Fetch all batches using the service
	const batches = await getAllBatchesService();

	// If no batches are found, log an error and pass a 404 error
	if (batches.length === 0) {
		// Log the error
		logger.error("No batches found", {
			label: "GetAllBatchesController",
		});

		// Pass a NotFoundError to the next middleware
		return next(
			new APIError(404, "No batches found", {
				type: "NotFoundError",
				details: [
					{
						field: "batches",
						message: "No batch records exist in the database.",
					},
				],
			}),
		);
	}

	// Log the successful retrieval of batches
	logger.info(`Fetched ${batches.length} batches`, {
		label: "GetAllBatchesController",
	});

	// Send a success response with the list of batches
	successResponse(res, 200, "Batches retrieved successfully", {
		batches,
	});
};

export default getAllBatchesController;
