// ============================================================
// 🔹FeeValidator — Validation logic for fee-related operations
// ============================================================
import Joi from "joi";

// ------------------------------------------------------
// Interface for CreateFeeBody
// ------------------------------------------------------
export interface CreateFeeBody {
	student_id: number;
	batch_id: number;
	amount_paid: number;
	mode: "cash" | "upi" | "bank";
	date: string;
}

// ------------------------------------------------------
// createFeeSchema{} — Validation schema for creating a fee
// ------------------------------------------------------
export const createFeeSchema = {
	body: Joi.object<CreateFeeBody>({
		student_id: Joi.number().required(),
		batch_id: Joi.number().required(),
		amount_paid: Joi.number().required(),
		mode: Joi.string().valid("cash", "upi", "bank").required(),
		date: Joi.string().required(),
	}),
};

// ===============================================================

// ------------------------------------------------------
// Interface for FeesReportQuery
// ------------------------------------------------------
export interface FeesReportQuery {
	type: "daily" | "monthly" | "yearly";
	date: string;
}

// ------------------------------------------------------
// feesReportQuerySchema{} — Validation schema for fee reports query
// ------------------------------------------------------
export const feesReportQuerySchema = {
	query: Joi.object<FeesReportQuery>({
		type: Joi.string().valid("daily", "monthly", "yearly").required(),
		date: Joi.string().required(),
	}),
};
