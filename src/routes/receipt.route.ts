// ============================================================
// 🔹ReceiptRoute — Routes related to receipt operations
// ============================================================

import { Router } from "express";
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
// @route   GET /api/v1/receipts/:payment_id
// @access  Private
router
	.route("/:payment_id")
	.get(
		authenticateMiddleware(["admin", "accountant"]),
		validateRequestMiddleware(receiptIdParamsSchema),
		asyncHandlerMiddleware(getReceiptInfoController),
	);

export default router;
