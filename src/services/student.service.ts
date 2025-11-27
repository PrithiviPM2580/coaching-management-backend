// ============================================================
// 🔹StudentService — Handles business logic related to students
// ============================================================

import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import {
	createStudentRepository,
	getAllStudentsRepository,
	getStudentByIdRepository,
	isBatchExistsRepository,
	updateStudentRepository,
} from "@/repositories/student.respository";
import type {
	CreateStudentBody,
	UpdateStudentBody,
} from "@/validator/student.validator";

// ------------------------------------------------------
// createStudentService() — Handles the business logic for creating a new student
// ------------------------------------------------------
export const createStudentService = async (studentData: CreateStudentBody) => {
	// Validate input data
	if (!studentData) {
		// Log an error if no student data is provided
		logger.error("No student data provided", {
			label: "createStudentService",
		});

		// Throw an API error for bad request
		throw new APIError(400, "No student data provided", {
			type: "BadRequest",
			details: [
				{
					field: "studentData",
					message: "Student data is required",
				},
			],
		});
	}

	// Check if the specified batch exists
	const batchId = await isBatchExistsRepository(studentData.batch_id);

	// If the batch does not exist, log an error and throw an API error
	if (!batchId) {
		// Log an error indicating the batch does not exist
		logger.error("Batch does not exist", {
			label: "createStudentService",
		});

		// Throw an API error for bad request due to non-existent batch
		throw new APIError(400, "Batch does not exist", {
			type: "BadRequest",
			details: [
				{
					field: "batch_id",
					message: "The specified batch does not exist",
				},
			],
		});
	}

	// Create the new student record using the repository function
	const newStudent = await createStudentRepository(studentData);

	// Return the newly created student record
	return newStudent;
};

// ------------------------------------------------------
// getAllStudentsService() — Handles the business logic for retrieving all students
// ------------------------------------------------------
export const getAllStudentsService = async () => {
	// Retrieve all students using the repository function
	const students = await getAllStudentsRepository();

	// Return the list of students
	return students;
};

// ------------------------------------------------------
// getStudentService() — Handles the business logic for retrieving a student by ID
// ------------------------------------------------------
export const getStudentService = async (studentId: number) => {
	// Validate the studentId input
	if (!studentId) {
		// Log an error if studentId is not provided
		logger.error("Student ID is required", {
			label: "getStudentService",
		});

		// Throw an API error for bad request
		throw new APIError(400, "Student ID is required", {
			type: "BadRequest",
			details: [
				{
					field: "studentId",
					message: "Student ID parameter is missing",
				},
			],
		});
	}

	// Retrieve the student by ID using the repository function
	const student = await getStudentByIdRepository(studentId);

	// Return the student record
	return student;
};

// ------------------------------------------------------
// updateStudentService() — Handles the business logic for updating a student by ID
// ------------------------------------------------------
export const updateStudentService = async (
	studentId: number,
	updateData: UpdateStudentBody,
) => {
	// Validate inputs
	if (!studentId) {
		// Log an error if studentId is not provided
		logger.error("Student ID is required", {
			label: "updateStudentService",
		});

		// Throw an API error for bad request
		throw new APIError(400, "Student ID is required", {
			type: "BadRequest",
			details: [
				{
					field: "studentId",
					message: "Student ID parameter is missing",
				},
			],
		});
	}

	// Validate updateData
	if (!updateData) {
		// Log an error if no update data is provided
		logger.error("No update data provided", {
			label: "updateStudentService",
		});

		// Throw an API error for bad request
		throw new APIError(400, "No update data provided", {
			type: "BadRequest",
			details: [
				{
					field: "updateData",
					message: "Update data is required",
				},
			],
		});
	}

	// Update the student record using the repository function
	const updatedStudent = await updateStudentRepository(studentId, updateData);

	// Return the updated student record
	return updatedStudent;
};
