// ============================================================
// 🔹CreateStudentController — Handles creating a new student
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { createStudentService } from "@/services/student.service";
import { successResponse } from "@/utils/index.util";
import type { CreateStudentBody } from "@/validator/student.validator";

// ------------------------------------------------------
// createStudentController() — Handles the creation of a new student
// ------------------------------------------------------
export const createStudentController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Call the service to create a new student
	const student = await createStudentService(req.body as CreateStudentBody);

	// If student creation failed, log an error and pass an API error to the next middleware
	if (!student) {
		// Log an error if student creation failed
		logger.error("Failed to create student", {
			label: "createStudentController",
		});

		// Pass an API error to the next middleware
		return next(
			new APIError(500, "Failed to create student", {
				type: "InternalServerError",
				details: [
					{
						field: "student",
						message: "Student creation failed due to server error",
					},
				],
			}),
		);
	}

	// Log success message
	logger.info("Student created successfully", {
		label: "createStudentController",
		student: student,
	});

	// Send success response with the created student data
	successResponse(res, 201, "Student created successfully", student);
};
