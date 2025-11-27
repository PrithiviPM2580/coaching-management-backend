// ============================================================
// 🔹BatchRoute — Routes related to batch operations
// ============================================================

import { Router } from "express";
import createBatchController from "@/controllers/batch/create-batch.controller";
import getAllBatchesController from "@/controllers/batch/get-all-batch.controller";
import asyncHandlerMiddleware from "@/middleware/async-handler.middleware";
import authenticateMiddleware from "@/middleware/authenticate.middleware";
import validateRequestMiddleware from "@/middleware/validate-request.middleware";
import { createBatchSchema } from "@/validator/batch.validator";

// Initialize the router
const router: Router = Router();

// ------------------------------------------------------
// Create Batch Route
// ------------------------------------------------------
// @desc    Create Batch Route
// @route   POST /api/v1/batches/
// @access  Private
router
	.route("/")
	.post(
		authenticateMiddleware(["admin", "staff"]),
		validateRequestMiddleware(createBatchSchema),
		asyncHandlerMiddleware(createBatchController),
	);

// ------------------------------------------------------
// Get All Batches Route
// ------------------------------------------------------
// @desc    Get All Batches Route
// @route   GET /api/v1/batches/
// @access  Private
router
	.route("/")
	.get(
		authenticateMiddleware(["admin", "staff", "accountant"]),
		asyncHandlerMiddleware(getAllBatchesController),
	);

export default router;
