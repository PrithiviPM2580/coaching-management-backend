// ============================================================
// 🔹StudentRepository — Handles data operations related to students
// ============================================================

import prisma from "@/config/prisma-client.config";
import type { CreateStudentBody } from "@/validator/student.validator";

// ------------------------------------------------------
// createStudentRepository() — Handles the data operation for creating a new student
// ------------------------------------------------------
export const createStudentRepository = async (
	studentData: CreateStudentBody,
) => {
	// Create and return the new student record
	return prisma.student.create({
		data: studentData,
	});
};

// ------------------------------------------------------
// isBatchExistsRepository() — Checks if a batch exists by its ID
// ------------------------------------------------------
export const isBatchExistsRepository = async (batchId: number) => {
	// Check if the batch with the given ID exists
	const batch = await prisma.batch.findUnique({
		where: {
			id: batchId,
		},
	});
	return !!batch;
};
