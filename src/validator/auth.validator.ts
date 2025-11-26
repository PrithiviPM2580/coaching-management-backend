// ============================================================
// 🧩 AuthValidator — Validation rules for authentication
// ============================================================

import Joi from "joi";

// ------------------------------------------------------
// Interface for Register Body
// ------------------------------------------------------
export interface RegisterBody {
	name: string;
	email: string;
	password: string;
}

// ------------------------------------------------------
// registerSchema{} — Validation schema for registering a new user
// ------------------------------------------------------
export const registerSchema = {
	body: Joi.object<RegisterBody>({
		name: Joi.string().min(3).max(30).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(20).required(),
	}),
};

// ------------------------------------------------------
// Interface for Login Body
// ------------------------------------------------------
export interface LoginBody {
	email: string;
	password: string;
}

// ------------------------------------------------------
// loginSchema{} — Validation schema for user login
// ------------------------------------------------------
export const loginSchema = {
	body: Joi.object<LoginBody>({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(20).required(),
	}),
};
