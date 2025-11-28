// ============================================================
// 🔹ReceiptValidator — Validation rules for receipt operations
// ============================================================
import Joi from "joi";

// ------------------------------------------------------
// Interface for ReceiptIdParams
// ------------------------------------------------------
export interface ReceiptIdParams {
	payment_id: string;
}

// ------------------------------------------------------
// receiptIdParamsSchema{} — Joi schema for validating ReceiptIdParams
// ------------------------------------------------------
export const receiptIdParamsSchema = {
	params: Joi.object<ReceiptIdParams>({
		payment_id: Joi.number().integer().positive().required(),
	}),
};
