// ============================================================
// 🔹BatchRoute — Routes related to batch operations
// ============================================================

import { Router } from "express";
import createBatchController from "@/controllers/batch/create-batch.controller";
import getAllBatchesController from "@/controllers/batch/get-all-batches.controller";
import asyncHandlerMiddleware from "@/middleware/async-handler.middleware";
import authenticateMiddleware from "@/middleware/authenticate.middleware";
import validateRequestMiddleware from "@/middleware/validate-request.middleware";
import getBatchController from "@/controllers/batch/get-batch.controller";
import {
	batchParamsSchema,
	createBatchSchema,
} from "@/validator/batch.validator";

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

// ------------------------------------------------------
// Get Batch Route
// ------------------------------------------------------
// @desc    Get Batch Route
// @route   GET /api/v1/batches/:batchId
// @access  Private
router
	.route("/:batchId")
	.get(
		authenticateMiddleware(["admin", "staff", "accountant"]),
		validateRequestMiddleware(batchParamsSchema),
		asyncHandlerMiddleware(getBatchController),
	);
export default router;
