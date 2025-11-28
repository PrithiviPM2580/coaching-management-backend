// ============================================================
// 🔹ReceiptRepository — Repository for handling receipt data operations
// ============================================================

import prisma from "@/config/prisma-client.config";

// ------------------------------------------------------
// findReceiptById() — Repository function to find a receipt by its ID
// ------------------------------------------------------
export const findReceiptById = async (receiptNumberId: number) => {
	// Fetch receipt by ID including related payment information
	return prisma.receipt.findUnique({
		where: { id: receiptNumberId },
		include: {
			payment: true,
		},
	});
};

// ------------------------------------------------------
// findReceiptById() — Repository function to find a receipt by its ID
// ------------------------------------------------------
export const findFeeById = async (receiptNumberId: number) => {
	// Fetch fee payment by ID including related student and batch information
	return prisma.feePayment.findUnique({
		where: { id: receiptNumberId },
		include: {
			student: true,
			batch: true,
		},
	});
};
