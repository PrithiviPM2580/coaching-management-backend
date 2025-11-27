// ============================================================
// 🔹StudentRoute Routes — Handles student-related API endpoints
// ============================================================

import { Router } from "express";
import { createStudentController } from "@/controllers/student/create-student.controller";
import deleteStudentController from "@/controllers/student/delete-student.controller";
import getAllStudentsController from "@/controllers/student/get-all-student.controller";
import getStudentController from "@/controllers/student/get-student.controller";
import updateStudentController from "@/controllers/student/update-student.controller";
import asyncHandlerMiddleware from "@/middleware/async-handler.middleware";
import authenticateMiddleware from "@/middleware/authenticate.middleware";
import validateRequestMiddleware from "@/middleware/validate-request.middleware";
import {
	createStudentSchema,
	studentParamsSchema,
} from "@/validator/student.validator";

// Initialize the router
const router: Router = Router();

// ------------------------------------------------------
// Create Student Route
// ------------------------------------------------------
// @desc    Create Student Route
// @route   POST /api/v1/students
// @access  Private
router
	.route("/")
	.post(
		authenticateMiddleware(["admin", "staff", "accountant"]),
		validateRequestMiddleware(createStudentSchema),
		asyncHandlerMiddleware(createStudentController),
	);

// ------------------------------------------------------
// Get All Students Route
// ------------------------------------------------------
// @desc    Get All Student Route
// @route   GET /api/v1/students
// @access  Private
router
	.route("/")
	.get(
		authenticateMiddleware(["admin", "staff", "accountant"]),
		asyncHandlerMiddleware(getAllStudentsController),
	);

// ------------------------------------------------------
// Get Student By StudentId route
// ------------------------------------------------------
// @desc    Get Student By StudentId Route
// @route   GET /api/v1/students/:studentId
// @access  Private
router
	.route("/:studentId")
	.get(
		authenticateMiddleware(["admin", "staff", "accountant"]),
		validateRequestMiddleware(studentParamsSchema),
		asyncHandlerMiddleware(getStudentController),
	);

// ------------------------------------------------------
// Update Student By StudentId
// ------------------------------------------------------
// @desc    Update Student By StudentId Route
// @route   PATCH  /api/v1/students/:studentId
// @access  Private
router
	.route("/:studentId")
	.patch(
		authenticateMiddleware(["admin"]),
		validateRequestMiddleware(studentParamsSchema),
		asyncHandlerMiddleware(updateStudentController),
	);

// ------------------------------------------------------
// Delete Student By StudentID
// ------------------------------------------------------
// @desc    Delete Student By StudentID Route
// @route   DELETE /api/v1/students/:studentId
// @access  Private
router
	.route("/:studentId")
	.delete(
		authenticateMiddleware(["admin"]),
		validateRequestMiddleware(studentParamsSchema),
		asyncHandlerMiddleware(deleteStudentController),
	);
export default router;
