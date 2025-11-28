// ============================================================
// 🔹ReceiptService — Service for handling receipt-related operations
// ============================================================

import type { Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import {
	findFeeById,
	findReceiptById,
} from "@/repositories/receipt.repository";
import { generatePDF } from "@/utils/index.util";

// ------------------------------------------------------
// getReceiptInfoService() — Service to get receipt information
// ------------------------------------------------------
export const getReceiptInfoService = async (paymentNumberId: number) => {
	// Validate paymentNumberId
	if (!paymentNumberId) {
		// Log error for missing paymentNumberId
		logger.error("Payment Number ID is required", {
			label: "GetReceiptInfoService",
		});

		// Throw API error for bad request
		throw new APIError(400, "Bad Request", {
			type: "BadRequest",
			details: [
				{
					field: "payment_number_id",
					message: "Payment Number ID is required.",
				},
			],
		});
	}

	// Fetch receipt from the repository
	const receipt = await findReceiptById(paymentNumberId);

	// Return the fetched receipt
	return receipt;
};

// ------------------------------------------------------
// generateReceiptPDFService() — Service to generate receipt PDF
// ------------------------------------------------------
export const generateReceiptPDFService = async (
	paymentNumberId: number,
	res: Response,
) => {
	// Validate paymentNumberId
	if (!paymentNumberId) {
		// Log error for missing paymentNumberId
		logger.error("Receipt Number ID is required", {
			label: "GenerateReceiptPDFService",
		});

		// Throw API error for bad request
		throw new APIError(400, "Bad Request", {
			type: "BadRequest",
			details: [
				{
					field: "payment_number_id",
					message: "Payment Number ID is required.",
				},
			],
		});
	}

	// Fetch receipt from the repository
	const fee = await findFeeById(paymentNumberId);

	// If receipt not found, throw error
	if (!fee) {
		// Log error for receipt not found
		logger.error(`Receipt with ID ${paymentNumberId} not found`, {
			label: "GenerateReceiptPDFService",
		});

		// Throw API error for not found
		throw new APIError(404, "Not Found", {
			type: "NotFound",
			details: [
				{
					field: "payment_number_id",
					message: `Receipt with ID ${paymentNumberId} not found.`,
				},
			],
		});
	}

	// Generate PDF for the receipt
	generatePDF(fee, paymentNumberId, res);
};
