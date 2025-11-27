// ============================================================
// 🔹GetStudentFeeController — Controller for getting student fee details
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { getStudentFeeService } from "@/services/fee.service";
import { successResponse } from "@/utils/index.util";
import type { StudentIDParams } from "@/validator/student.validator";

// ------------------------------------------------------
// getStudentFeeController() — Controller to handle getting student fee details
// ------------------------------------------------------
const getStudentFeeController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract studentId from request parameters
	const studentId = req.params.studentId as StudentIDParams["studentId"];

	// Convert studentId to number
	const studentNumberId = Number(studentId);

	// Validate studentId presence
	if (!studentId) {
		// Log the error
		logger.error(`Student ID is missing in the request parameters.`, {
			label: "GetStudentFeeController",
		});

		// Throw an API error
		return next(
			new APIError(400, "Student ID is required.", {
				type: "BadRequest",
				details: [
					{
						field: "studentId",
						message: "Student ID is required.",
					},
				],
			}),
		);
	}

	// Call the service layer to get student fee details
	const { student, payments } = await getStudentFeeService(studentNumberId);

	// Handle case where student does not exist
	if (!student) {
		// Log the error
		logger.error(`Student with ID ${studentId} does not exist.`, {
			label: "GetStudentFeeController",
		});

		// Throw an API error
		return next(
			new APIError(404, "Student does not exist.", {
				type: "NotFound",
				details: [
					{
						field: "studentId",
						message: "Student does not exist.",
					},
				],
			}),
		);
	}

	// Handle case where no payments are found for the student
	if (!payments) {
		// Log the error
		logger.error(`No payments found for student with ID ${studentId}.`, {
			label: "GetStudentFeeController",
		});

		// Throw an API error
		return next(
			new APIError(404, "No payments found for the student.", {
				type: "NotFound",
				details: [
					{
						field: "studentId",
						message: "No payments found for the student.",
					},
				],
			}),
		);
	}

	// Log successful retrieval of student fee details
	logger.info(
		`Successfully retrieved fee details for student with ID ${studentId}.`,
		{
			label: "GetStudentFeeController",
		},
	);

	// Send success response with student fee details
	successResponse(res, 200, "Student fee details retrieved successfully.", {
		student,
		payments,
	});
};

export default getStudentFeeController;
