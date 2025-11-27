// ============================================================
// 🔹CreateFeeController — Controller for creating student fee payments
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { createFeeService } from "@/services/fee.service";
import { successResponse } from "@/utils/index.util";
import type { CreateFeeBody } from "@/validator/fee.validator";

// ------------------------------------------------------
// createFeeController() — Controller to handle creating a student fee payment
// ------------------------------------------------------
const createFeeController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Call the service to create the fee payment
	const [feePayment, updateStudent] = await createFeeService(
		req.body as CreateFeeBody,
	);

	// If fee payment creation failed, throw an error
	if (!feePayment) {
		// Log the error
		logger.error("Failed to create fee payment", {
			label: "CreateFeeController",
		});

		// Throw an API error
		return next(
			new APIError(500, "Failed to create fee payment", {
				type: "InternalServerError",
				details: [
					{
						field: "fee",
						message: "Fee payment could not be created",
					},
				],
			}),
		);
	}

	// If student due amount update failed, throw an error
	if (!updateStudent) {
		// Log the error
		logger.error("Failed to update student due amount", {
			label: "CreateFeeController",
		});

		// Throw an API error
		return next(
			new APIError(500, "Failed to update student due amount", {
				type: "InternalServerError",
				details: [
					{
						field: "student",
						message: "Student due amount could not be updated",
					},
				],
			}),
		);
	}

	// Log the successful creation of the fee payment
	logger.info("Fee payment created successfully", {
		label: "CreateFeeController",
		feeId: feePayment.id,
	});

	// Send success response
	successResponse(res, 201, "Fee payment created successfully", feePayment);
};

export default createFeeController;
