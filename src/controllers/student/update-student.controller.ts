// ============================================================
// 🔹UpdateStudentController —
// ============================================================
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import type {
	StudentIDParams,
	UpdateStudentBody,
} from "@/validator/student.validator";
import type { Request, Response, NextFunction } from "express";
import { updateStudentService } from "@/services/student.service";
import { successResponse } from "@/utils/index.util";

// ------------------------------------------------------
// updateStudentController() — Handles updating a student by ID
// ------------------------------------------------------
const updateStudentController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Extract studentId from request parameters
	const studentid = req.params.studentId as StudentIDParams["studentId"];

	// Validate the presence of studentId
	if (!studentid) {
		// Log an error if studentId is missing
		logger.error(`Student ID is missing in the request parameters.`, {
			label: "UpdateStudentController",
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

	//  Convert studentId to number
	const studentIdNumber = Number(studentid);

	// Update the student using the service function
	const updatedData = await updateStudentService(
		studentIdNumber,
		req.body as UpdateStudentBody,
	);

	// Handle case where update fails
	if (!updatedData) {
		// Log an error if the update fails
		logger.error(`Failed to update student with ID ${studentid}.`, {
			label: "UpdateStudentController",
		});

		// Throw an API error for internal server error
		return next(
			new APIError(500, "Failed to update student", {
				type: "InternalServerError",
				details: [
					{
						field: "student",
						message: "An error occurred while updating the student record",
					},
				],
			}),
		);
	}

	// Log success message
	logger.info(`Student with ID ${studentid} updated successfully.`, {
		label: "UpdateStudentController",
	});

	// Send success response with the updated student data
	successResponse(res, 201, "Student updated successfully", updatedData);
};

export default updateStudentController;
