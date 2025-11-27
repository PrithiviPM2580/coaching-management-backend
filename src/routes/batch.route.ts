// ============================================================
// 🔹BatchRoute — Routes related to batch operations
// ============================================================

import { Router } from "express";
import createBatchController from "@/controllers/batch/create-batch.controller";
import getAllBatchesController from "@/controllers/batch/get-all-batches.controller";
import getBatchController from "@/controllers/batch/get-batch.controller";
import asyncHandlerMiddleware from "@/middleware/async-handler.middleware";
import authenticateMiddleware from "@/middleware/authenticate.middleware";
import updateBatchController from "@/controllers/batch/update-batch.controller";
import validateRequestMiddleware from "@/middleware/validate-request.middleware";
import {
	batchParamsSchema,
	createBatchSchema,
	updateBatchSchema,
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
// Get Batch By BatchId Route
// ------------------------------------------------------
// @desc    Get Batch By BatchId Route
// @route   GET /api/v1/batches/:batchId
// @access  Private
router
	.route("/:batchId")
	.get(
		authenticateMiddleware(["admin", "staff", "accountant"]),
		validateRequestMiddleware(batchParamsSchema),
		asyncHandlerMiddleware(getBatchController),
	);

// ------------------------------------------------------
// Update Batch By BatchId Route
// ------------------------------------------------------
// @desc    Update Batch By BatchId Route
// @route   PATCH /api/v1/batches/:batchId
// @access  Private
router
	.route("/:batchId")
	.patch(
		authenticateMiddleware(["admin"]),
		validateRequestMiddleware(updateBatchSchema),
		asyncHandlerMiddleware(updateBatchController),
	);
export default router;
