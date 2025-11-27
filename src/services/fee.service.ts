// ============================================================
// 🔹FeeService — Business logic for fee-related operations
// ============================================================

import APIError from "@/lib/api-error.lib";
import logger from "@/lib/logger.lib";
import { findBatchByIdRepository } from "@/repositories/batch.repository";
import {
	createFeeRepository,
	getPaymentsByStudentIdRepository,
} from "@/repositories/fee.repository";
import { findStudentByIdRepository } from "@/repositories/student.respository";
import { generateReceiptNumber, studentDueAmount } from "@/utils/index.util";
import type { CreateFeeBody } from "@/validator/fee.validator";

// ------------------------------------------------------
// createFeeService() — Business logic to create a student fee payment
// ------------------------------------------------------
export const createFeeService = async (feeData: CreateFeeBody) => {
	// Validate input data
	if (!feeData) {
		//	 Log the error
		logger.error("No fee data provided", {
			label: "FeeService",
		});

		// Throw an API error
		throw new APIError(400, "No fee data provided", {
			type: "BadRequest",
			details: [
				{
					field: "feeData",
					message: "Fee data is required",
				},
			],
		});
	}

	// Check if student exists
	const student = await findStudentByIdRepository(feeData.student_id);

	// If student does not exist, throw an error
	if (!student) {
		// Log the error
		logger.error("Student does not exist", {
			label: "FeeService",
		});

		// Throw an API error
		throw new APIError(400, "Student does not exist", {
			type: "BadRequest",
			details: [
				{
					field: "student_id",
					message: "Student does not exist",
				},
			],
		});
	}

	// Check if batch exists
	const batch = await findBatchByIdRepository(feeData.batch_id);

	// If batch does not exist, throw an error
	if (!batch) {
		// Log the error
		logger.error("Batch does not exist", {
			label: "FeeService",
		});

		// Throw an API error
		throw new APIError(400, "Batch does not exist", {
			type: "BadRequest",
			details: [
				{
					field: "batch_id",
					message: "Batch does not exist",
				},
			],
		});
	}

	// Calculate new due amount for the student
	const newDue = studentDueAmount(student.due_amount, feeData.amount_paid);

	// Generate a unique receipt number
	const receiptNumber = generateReceiptNumber();

	// Create the fee payment record and update student's due amount
	const [feePayment, updateStudent] = await createFeeRepository(
		feeData,
		receiptNumber,
		newDue,
	);

	// Return the created fee payment record
	return [feePayment, updateStudent];
};

// ------------------------------------------------------
// getStudentFeeService() — Business logic to get student fee details
// ------------------------------------------------------
export const getStudentFeeService = async (studentId: number) => {
	// Validate student ID
	if (!studentId) {
		// Log the error
		logger.error(`Student ID is missing in the service layer.`, {
			label: "GetStudentFeeService",
		});

		// Throw an API error
		throw new APIError(400, "Student ID is required.", {
			type: "BadRequest",
			details: [
				{
					field: "studentId",
					message: "Student ID is required.",
				},
			],
		});
	}

	// Check if student exists
	const student = await findStudentByIdRepository(studentId);

	// If student does not exist, throw an error
	if (!student) {
		// Log the error
		logger.error(`Student with ID ${studentId} does not exist.`, {
			label: "GetStudentFeeService",
		});

		// Throw an API error
		throw new APIError(404, "Student does not exist.", {
			type: "NotFound",
			details: [
				{
					field: "studentId",
					message: "Student does not exist.",
				},
			],
		});
	}

	// Retrieve all fee payments for the student
	const payments = await getPaymentsByStudentIdRepository(studentId);

	// Return student details along with their fee payments
	return { student, payments };
};
