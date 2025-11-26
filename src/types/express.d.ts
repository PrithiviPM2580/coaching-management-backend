// ============================================================
// 🧩 Express Type defination —
// ============================================================

declare global {
	namespace Express {
		interface Request {
			student?: TokenPayload;
		}
	}
}

export {};
