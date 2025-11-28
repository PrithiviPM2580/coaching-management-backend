// ============================================================
// 🔹ReceiptValidator — Validation rules for receipt operations
// ============================================================
import Joi from "joi";

// ------------------------------------------------------
// Interface for ReceiptIdParams
// ------------------------------------------------------
export interface ReceiptIdParams {
	paymentId: string;
}

// ------------------------------------------------------
// receiptIdParamsSchema{} — Joi schema for validating ReceiptIdParams
// ------------------------------------------------------
export const receiptIdParamsSchema = {
	params: Joi.object<ReceiptIdParams>({
		paymentId: Joi.number().integer().positive().required(),
	}),
};
