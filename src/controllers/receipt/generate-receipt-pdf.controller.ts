// ============================================================
// 🔹GenerateReceiptPDFController — Controller for generating receipt PDF
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { generateReceiptPDFService } from "@/services/receipt.service";
import type { ReceiptIdParams } from "@/validator/receipt.validator";

// ------------------------------------------------------
// gennerateReceiptPDFController() — Controller to handle generating receipt PDF
// ------------------------------------------------------
const generateReceiptPDFController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const paymentId = req.params.paymentId as ReceiptIdParams["paymentId"];

	const paymentNumberId = Number(paymentId);
	if (!paymentId) {
		logger.error("Payment ID is missing in the request parameters", {
			label: "GenerateReceiptPDFController",
		});

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

	await generateReceiptPDFService(paymentNumberId, res);

	logger.info("Receipt PDF generated successfully", {
		label: "GenerateReceiptPDFController",
	});
};

export default generateReceiptPDFController;
