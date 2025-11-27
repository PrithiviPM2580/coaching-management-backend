// ============================================================
// 🔹StudentValidator — Validation rules for student data
// ============================================================

import Joi from "joi";

// ------------------------------------------------------
// Interface for Student Create Body
// ------------------------------------------------------
export interface CreateStudentBody {
	name: string;
	phone: string;
	join_date: string;
	batch_id: number;
	address?: string;
	guardian_name?: string;
	guardian_phone?: string;
}

// ------------------------------------------------------
// createStudentBody — Validation schema for creating a student
// ------------------------------------------------------
export const createStudentSchema = {
	body: Joi.object<CreateStudentBody>({
		name: Joi.string().min(3).max(50).required(),
		phone: Joi.string()
			.pattern(/^[0-9]{10}$/)
			.required(),
		join_date: Joi.date().iso().required(),
		batch_id: Joi.number().integer().positive().required(),
		address: Joi.string().max(100).optional(),
		guardian_name: Joi.string().min(3).max(50).optional(),
		guardian_phone: Joi.string()
			.pattern(/^[0-9]{10}$/)
			.optional(),
	}),
};
// ============================================================

// ------------------------------------------------------
// Interface for StudentID
// ------------------------------------------------------
export interface StudentIDParams {
	studentId: string;
}

// ------------------------------------------------------
// studnetParamsSchema{} — Validation schema for student ID params
// ------------------------------------------------------
export const studentParamsSchema = {
	params: Joi.object<StudentIDParams>({
		studentId: Joi.number().integer().positive().required(),
	}),
};

// ===============================================================

// ------------------------------------------------------
// Interface for UpdateStudent By Id
// ------------------------------------------------------
export interface UpdateStudentBody {
	name?: string;
	phone?: string;
	join_date?: string;
	batch_id?: number;
	address?: string;
	guardian_name?: string;
	guardian_phone?: string;
}

// ------------------------------------------------------
// updateStudentSchema{} — Validation schema for updating a student
// ------------------------------------------------------
export const updateStudentSchema = {
	body: Joi.object<UpdateStudentBody>({
		name: Joi.string().min(3).max(50).optional(),
		phone: Joi.string()
			.pattern(/^[0-9]{10}$/)
			.optional(),
		join_date: Joi.date().iso().optional(),
		batch_id: Joi.number().integer().positive().optional(),
		address: Joi.string().max(100).optional(),
		guardian_name: Joi.string().min(3).max(50).optional(),
		guardian_phone: Joi.string()
			.pattern(/^[0-9]{10}$/)
			.optional(),
	}).min(1),
	params: Joi.object<StudentIDParams>({
		studentId: Joi.number().integer().positive().required(),
	}),
};
