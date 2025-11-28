// ============================================================
// 🔹FeeRepository — Data access layer for fee-related operations
// ============================================================

import prisma from "@/config/prisma-client.config";
import type { CreateFeeBody } from "@/validator/fee.validator";

// ------------------------------------------------------
// createFeeRepository() — Creates a new fee payment record
// ------------------------------------------------------
export const createFeeRepository = async (
	feeData: CreateFeeBody,
	receiptNumber: string,
	newDue: number,
) => {
	// Use a transaction to ensure both fee payment creation and student due amount update happen atomically
	return prisma.$transaction([
		prisma.feePayment.create({
			data: {
				receipt_no: receiptNumber,
				student_id: feeData.student_id,
				batch_id: feeData.batch_id,
				amount_paid: feeData.amount_paid,
				mode: feeData.mode,
				date: feeData.date ? new Date(feeData.date) : new Date(),
			},
		}),
		prisma.student.update({
			where: { id: feeData.student_id },
			data: {
				due_amount: newDue,
			},
		}),
	]);
};

// ------------------------------------------------------
// getPaymentsByStudentIdRepository() — Retrieves all fee payments for a given student ID
// ------------------------------------------------------
export const getPaymentsByStudentIdRepository = async (studentId: number) => {
	// Fetch all fee payment records for the specified student ID, ordered by date descending
	return prisma.feePayment.findMany({
		where: { student_id: studentId },
		orderBy: { date: "desc" },
	});
};

// ------------------------------------------------------
// getFeeReportsRepository() — Retrieves fee reports within a date range
// ------------------------------------------------------
export const getFeeReportsRepository = async (
	startDate: Date,
	endDate: Date,
) => {
	// Aggregate the total amount paid within the specified date range
	return prisma.feePayment.aggregate({
		_sum: { amount_paid: true },
		where: {
			date: {
				gte: startDate,
				lte: endDate,
			},
		},
	});
};

// ------------------------------------------------------
// getFeeReportsBreakdownRepository() — Retrieves fee reports breakdown by type
// ------------------------------------------------------
export const getFeeResportsBreakdownRepository = async (
	type: "daily" | "monthly" | "yearly",
	startDate: Date,
	endDate: Date,
) => {
	// Group fee payments by date or student based on the report type
	return prisma.feePayment.groupBy({
		by: type === "daily" ? ["date"] : ["student_id"],
		_sum: { amount_paid: true },
		where: {
			date: {
				gte: startDate,
				lte: endDate,
			},
		},
	});
};
