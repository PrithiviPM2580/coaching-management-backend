// ============================================================
// 🔹GetStudentController — Handles retrieving a student by ID
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { getStudentService } from "@/services/student.service";
import { successResponse } from "@/utils/index.util";
import type { StudentIDParams } from "@/validator/student.validator";

// ------------------------------------------------------
// getStudentController() — Handles retrieving a student by ID
// ------------------------------------------------------
const getStudentController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract studentId from request parameters
	const studentId = req.params.studentId as StudentIDParams["studentId"];

	// Validate the presence of studentId
	if (!studentId) {
		// Log an error if studentId is missing
		logger.error(`Student ID is missing in the request parameters.`, {
			label: "GetStudentController",
		});

		// Throw an API error for bad request
		return next(
			new APIError(400, "Student ID is required", {
				type: "BadRequest",
				details: [
					{
						field: "studentId",
						message: "Student ID parameter is missing",
					},
				],
			}),
		);
	}

	// Convert studentId to number
	const studentIdNumber = Number(studentId);

	// Retrieve the student using the service function
	const student = await getStudentService(studentIdNumber);

	// Handle case where student is not found
	if (!student) {
		// Log an error if the student is not found
		logger.error(`Student with ID ${studentId} not found.`, {
			label: "GetStudentController",
		});

		// Throw an API error for not found
		return next(
			new APIError(404, "Student not found", {
				type: "NotFound",
				details: [
					{
						field: "studentId",
						message: `No student found with ID ${studentId}`,
					},
				],
			}),
		);
	}

	// Log successful retrieval of student
	logger.info(`Student with ID ${studentId} retrieved successfully.`, {
		label: "GetStudentController",
	});

	// Send success response with the retrieved student data
	successResponse(res, 200, "Student retrieved successfully", student);
};

export default getStudentController;
