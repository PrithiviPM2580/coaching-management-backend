// ============================================================
// 🔹FeeRoute — Routes related to fee management
// ============================================================

import { Router } from "express";
import createFeeController from "@/controllers/fee/create-fee.controller";
import getFeeReportsController from "@/controllers/fee/get-fee-report.controller";
import getStudentFeeController from "@/controllers/fee/get-student-fee.controller";
import asyncHandlerMiddleware from "@/middleware/async-handler.middleware";
import authenticateMiddleware from "@/middleware/authenticate.middleware";
import validateRequestMiddleware from "@/middleware/validate-request.middleware";
import {
	createFeeSchema,
	feesReportQuerySchema,
} from "@/validator/fee.validator";
import { studentParamsSchema } from "@/validator/student.validator";

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

// ------------------------------------------------------
// Get Fee of Student By StudentId Route
// ------------------------------------------------------
// @desc    Get Fee of Student By StudentId Route
// @route   GET /api/v1/fees/student/:studentId
// @access  Private
router
	.route("/student/:studentId")
	.get(
		authenticateMiddleware(["admin", "accountant"]),
		validateRequestMiddleware(studentParamsSchema),
		asyncHandlerMiddleware(getStudentFeeController),
	);

// ------------------------------------------------------
// Get Fee Reports Route
// -----------------------------------------------------
// @desc    Get Fee Reports Route
// @route   GET /api/v1/fees/reports
// @access  Private
router
	.route("/reports")
	.get(
		authenticateMiddleware(["admin"]),
		validateRequestMiddleware(feesReportQuerySchema),
		asyncHandlerMiddleware(getFeeReportsController),
	);

export default router;
