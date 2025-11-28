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

	type PaymentMode = "cash" | "upi" | "bank";

	export interface Receipt {
		id: number;
		payment_id: number;
		pdf_path: string;
		created_at: Date;
		payment: Payment; // nested relation
	}

	export interface Batch {
		id: number;
		batch_name: string;
		subject: string;
		teacher: string;
		timing: Timing;
		monthly_fees: number;
		created_at: Date;
		updated_at: Date;
	}

	export interface Student {
		id: number;
		name: string;
		phone: string;
		fees: number;
		due_amount: number;
		join_date: Date;
		address: string | null;
		guardian_name: string | null;
		guardian_phone: string | null;
		batch_id: number;
		created_at: Date;
		updated_at: Date;
	}

	export interface FeePayment {
		id: number;
		receipt_no: string;
		amount_paid: number;
		mode: PaymentMode;
		date: Date;
		created_at: Date;
		updated_at: Date;
		student_id: number;
		batch_id: number;

		// relations
		student: Student;
		batch: Batch;
	}
}

export {};
