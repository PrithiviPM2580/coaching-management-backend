// ============================================================
// 🔹ReceiptService — Service for handling receipt-related operations
// ============================================================

import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { findReceiptById } from "@/repositories/receipt.repository";

// ------------------------------------------------------
// getReceiptInfoService() — Service to get receipt information
// ------------------------------------------------------
export const getReceiptInfoService = async (receiptNumberId: number) => {
	// Validate receiptNumberId
	if (!receiptNumberId) {
		// Log error for missing receiptNumberId
		logger.error("Receipt Number ID is required", {
			label: "GetReceiptInfoService",
		});

		// Throw API error for bad request
		throw new APIError(400, "Bad Request", {
			type: "BadRequest",
			details: [
				{
					field: "receipt_number_id",
					message: "Receipt Number ID is required.",
				},
			],
		});
	}

	// Fetch receipt from the repository
	const receipt = await findReceiptById(receiptNumberId);

	// Return the fetched receipt
	return receipt;
};
