// ============================================================
// 🔹GetAllStudents — Handles retrieving all students
// ============================================================
import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { getAllStudentsService } from "@/services/student.service";
import { successResponse } from "@/utils/index.util";

// ------------------------------------------------------
// getAllStudentsController() — Handles retrieving all students
// ------------------------------------------------------
const getAllStudentsController = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	//
	const students = await getAllStudentsService();

	// If no students are found, log an error and pass an API error to the next middleware
	if (students.length === 0) {
		// Log an error indicating no students were found
		logger.error("No students found", {
			label: "getAllStudentsController",
		});

		// Pass an API error to the next middleware
		return next(
			new APIError(404, "No students found", {
				type: "NotFound",
				details: [
					{
						field: "students",
						message: "No student records exist in the database",
					},
				],
			}),
		);
	}

	// Log the successful retrieval of students
	logger.info("Students retrieved successfully", {
		label: "getAllStudentsController",
		studentsCount: students.length,
	});

	// Send a success response with the retrieved students
	successResponse(res, 200, "Students retrieved successfully", students);
};

export default getAllStudentsController;
