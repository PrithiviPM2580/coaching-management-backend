// ============================================================
// 🔹BatchValidator — Validation rules for batch operations
// ============================================================

import Joi from "joi";

// ------------------------------------------------------
// Interface for Create Batch Body
// ------------------------------------------------------
export interface CreateBatchBody {
	batch_name: string;
	subject: string;
	teacher: string;
	timing: "morning" | "day" | "evening";
	monthly_fees: number;
}

// ------------------------------------------------------
// createBatchSchema — Validation schema for creating a batch
// ------------------------------------------------------
export const createBatchSchema = {
	body: Joi.object({
		batch_name: Joi.string().min(3).max(50).required(),
		subject: Joi.string().min(3).max(50).required(),
		teacher: Joi.string().min(3).max(50).required(),
		timing: Joi.string().valid("MORNING", "DAY", "EVENING").required(),
		monthly_fees: Joi.number().positive().required(),
	}),
};
