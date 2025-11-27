// ============================================================
// 🔹FeeRoute — Routes related to fee management
// ============================================================

import { Router } from "express";
import createFeeController from "@/controllers/fee/create-fee.controller";
import asyncHandlerMiddleware from "@/middleware/async-handler.middleware";
import authenticateMiddleware from "@/middleware/authenticate.middleware";
import validateRequestMiddleware from "@/middleware/validate-request.middleware";
import { createFeeSchema } from "@/validator/fee.validator";

// Initialize router
const router: Router = Router();

// ------------------------------------------------------
// Create Student Payment Route
// ------------------------------------------------------
// @desc    Create Student Payment Route
// @route   POST /api/v1/fees/pay
// @access  Private
router
	.route("/pay")
	.post(
		authenticateMiddleware(["admin", "accountant"]),
		validateRequestMiddleware(createFeeSchema),
		asyncHandlerMiddleware(createFeeController),
	);

export default router;
