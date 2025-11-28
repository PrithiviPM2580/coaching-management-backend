// ============================================================
// 🔹GetReceiptInfoController — Controller for getting receipt information
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { getReceiptInfoService } from "@/services/receipt.service";
import { successResponse } from "@/utils/index.util";
import type { ReceiptIdParams } from "@/validator/receipt.validator";

// ------------------------------------------------------
// getReceiptInfoController() — Controller to handle getting receipt information
// ------------------------------------------------------
const getReceiptInfoController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract payment_id from request parameters
	const paymentId = req.params.payment_id as ReceiptIdParams["payment_id"];

	// Convert paymentId to number
	const receiptNumberId = Number(paymentId);

	// Validate paymentId
	if (!paymentId) {
		// Log error for missing paymentId
		logger.error("Payment ID is missing in the request parameters", {
			label: "GetReceiptInfoController",
		});

		// Throw API error for bad request
		return next(
			new APIError(400, "Bad Request", {
				type: "BadRequest",
				details: [
					{
						field: "payment_id",
						message: "Payment ID is required.",
					},
				],
			}),
		);
	}

	// Call the service to get receipt information
	const receiptInfo = await getReceiptInfoService(receiptNumberId);

	// If no receipt found, throw not found error
	if (!receiptInfo) {
		// Log error for not found receipt
		logger.error(`No receipt found for Payment ID: ${paymentId}`, {
			label: "GetReceiptInfoController",
		});

		// Throw API error for not found receipt
		return next(
			new APIError(404, "Not Found", {
				type: "NotFound",
				details: [
					{
						field: "payment_id",
						message: `No receipt found for Payment ID: ${paymentId}.`,
					},
				],
			}),
		);
	}

	// Log successful retrieval of receipt info
	logger.info(
		`Successfully retrieved receipt info for Payment ID: ${paymentId}`,
		{
			label: "GetReceiptInfoController",
			receiptInfo,
		},
	);

	// Send success response with receipt information
	successResponse(
		res,
		200,
		"Receipt information retrieved successfully",
		receiptInfo,
	);
};

export default getReceiptInfoController;
