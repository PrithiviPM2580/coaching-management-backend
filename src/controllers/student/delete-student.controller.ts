// ============================================================
// 🔹DeleteStudentController — Handles deleting a student by ID
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { deleteStudentService } from "@/services/student.service";
import { successResponse } from "@/utils/index.util";
import type { StudentIDParams } from "@/validator/student.validator";

// ------------------------------------------------------
// deleteStudentController() — Handles deleting a student by ID
// ------------------------------------------------------
const deleteStudentController = async (
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
			label: "DeleteStudentController",
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

	// Call the service to delete the student
	const deleted = await deleteStudentService(studentIdNumber);

	// Log success message
	logger.info(`Student with ID ${studentId} deleted successfully.`, {
		label: "DeleteStudentController",
	});

	// Send success response
	successResponse(res, 200, "Student deleted successfully", { deleted });
};

export default deleteStudentController;
