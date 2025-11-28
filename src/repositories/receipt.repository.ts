// ============================================================
// 🔹ReceiptRepository — Repository for handling receipt data operations
// ============================================================

import prisma from "@/config/prisma-client.config";

// ------------------------------------------------------
// findReceiptById() — Repository function to find a receipt by its ID
// ------------------------------------------------------
export const findReceiptById = async (receiptNumberId: number) => {
	return prisma.receipt.findUnique({
		where: { id: receiptNumberId },
		include: {
			payment: true,
		},
	});
};
