// ============================================================
// 🔹StudentRepository — Handles data operations related to students
// ============================================================

import prisma from "@/config/prisma-client.config";
import type {
	CreateStudentBody,
	UpdateStudentBody,
} from "@/validator/student.validator";

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

// ------------------------------------------------------
// getAllStudentsRepository() — Retrieves all students from the database
// ------------------------------------------------------
export const getAllStudentsRepository = async () => {
	// Retrieve and return all student records
	return prisma.student.findMany({
		include: {
			batch: true,
		},
		orderBy: {
			created_at: "desc",
		},
	});
};

// ------------------------------------------------------
// getStudentByIdRepository() — Retrieves a student by their ID
// ------------------------------------------------------
export const getStudentByIdRepository = async (studentId: number) => {
	// Retrieve and return the student record with the specified ID
	return prisma.student.findUnique({
		where: { id: studentId },
		include: {
			batch: true,
		},
	});
};

// ------------------------------------------------------
// updateStudentRepository() — Updates a student by their ID
// ------------------------------------------------------
export const updateStudentRepository = async (
	studentId: number,
	updateData: UpdateStudentBody,
) => {
	// Update and return the student record with the specified ID
	return prisma.student.update({
		where: { id: studentId },
		data: updateData,
	});
};

// ------------------------------------------------------
// deleteStudentRepository() — Deletes a student by their ID
// ------------------------------------------------------
export const deleteStudentRepository = async (studentId: number) => {
	// Delete the student record with the specified ID
	return prisma.student.delete({
		where: { id: studentId },
	});
};
