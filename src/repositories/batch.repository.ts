// ============================================================
// 🔹BatchRepository — Data access layer for batch operations
// ============================================================

import prisma from "@/config/prisma-client.config";
import type { CreateBatchBody } from "@/validator/batch.validator";

// ------------------------------------------------------
// createBatchRepository() — Function to create a new batch in the database
// ------------------------------------------------------
export const createBatchRepository = async (batchData: CreateBatchBody) => {
	// Create and return the new batch record
	return prisma.batch.create({
		data: batchData,
	});
};

// ------------------------------------------------------
// getAllBatchesRepository() — Function to fetch all batches from the database
// ------------------------------------------------------
export const getAllBatchesRepository = async () => {
	// Fetch and return all batch records
	return prisma.batch.findMany({
		orderBy: {
			created_at: "desc",
		},
	});
};
