// ============================================================
// 🔹ReceiptRoute — Routes related to receipt operations
// ============================================================

import { Router } from "express";
import generateReceiptPDFController from "@/controllers/receipt/generate-receipt-pdf.controller";
import getReceiptInfoController from "@/controllers/receipt/get-receipt-info.controller";
import asyncHandlerMiddleware from "@/middleware/async-handler.middleware";
import authenticateMiddleware from "@/middleware/authenticate.middleware";
import validateRequestMiddleware from "@/middleware/validate-request.middleware";
import { receiptIdParamsSchema } from "@/validator/receipt.validator";

// Initialize the router
const router: Router = Router();

// ------------------------------------------------------
// Get Receipt Info Route
// ------------------------------------------------------
// @desc    Get Receipt Info Route
// @route   GET /api/v1/receipts/:paymentId
// @access  Private
router
	.route("/:paymentId")
	.get(
		authenticateMiddleware(["admin", "accountant"]),
		validateRequestMiddleware(receiptIdParamsSchema),
		asyncHandlerMiddleware(getReceiptInfoController),
	);

// ------------------------------------------------------
// Generate PDF Receipt Route
// ------------------------------------------------------
// @desc    Generate PDF Receipt Route
// @route   GET /api/v1/receipts/:paymentId/pdf
// @access  Private
router
	.route("/:paymentId/pdf")
	.get(
		authenticateMiddleware(["admin", "accountant"]),
		validateRequestMiddleware(receiptIdParamsSchema),
		asyncHandlerMiddleware(generateReceiptPDFController),
	);
export default router;
