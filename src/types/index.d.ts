// ============================================================
// 🧩 Global Type Defination —
// ============================================================

declare global {
	interface ErrrorDetails {
		field?: string;
		message?: string;
	}

	interface ErrorType {
		type?: string;
		details?: ErrrorDetails[];
	}

	type APIErrorType = string | ErrorType;

	type Role = "admin" | "staff" | "accountant";

	type TokenPayload = {
		userId: number;
		role: Role;
	};

	interface RequestValidate {
		body?: Joi.ObjectSchema;
		query?: Joi.ObjectSchema;
		params?: Joi.ObjectSchema;
	}

	interface IToken {
		user_id: number;
		token: string;
		expires_at: Date;
	}
}

export {};
