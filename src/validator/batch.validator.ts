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

// ===============================================================

// ------------------------------------------------------
// Interface for BatchID
// ------------------------------------------------------
export interface BatchIDParams {
	batchId: string;
}

// ------------------------------------------------------
// batchParamsSchema{} — Validation schema for batch ID params
// ------------------------------------------------------
export const batchParamsSchema = {
	params: Joi.object<BatchIDParams>({
		batchId: Joi.number().integer().positive().required(),
	}),
};

// ===============================================================

// ------------------------------------------------------
// Interface for Update Batch Body
// ------------------------------------------------------
export interface UpdateBatchBody {
	batch_name?: string;
	subject?: string;
	teacher?: string;
	timing?: "morning" | "day" | "evening";
	monthly_fees?: number;
}

// ------------------------------------------------------
// updateBatchSchema — Validation schema for updating a batch
// ------------------------------------------------------
export const updateBatchSchema = {
	body: Joi.object({
		batch_name: Joi.string().min(3).max(50).optional(),
		subject: Joi.string().min(3).max(50).optional(),
		teacher: Joi.string().min(3).max(50).optional(),
		timing: Joi.string().valid("MORNING", "DAY", "EVENING").optional(),
		monthly_fees: Joi.number().positive().optional(),
	}).min(1),
	params: Joi.object<BatchIDParams>({
		batchId: Joi.number().integer().positive().required(),
	}),
};
