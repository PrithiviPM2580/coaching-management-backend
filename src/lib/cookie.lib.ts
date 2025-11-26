// ============================================================
// 🧩 CookieLib — Cookie Utility Functions
// ============================================================

import type { CookieOptions, Request, Response } from "express";
import config from "@/config/env.config";

const cookie = {
	getOptions: (): CookieOptions => ({
		httpOnly: true, // Prevent client-side JavaScript access
		secure: config.NODE_ENV === "production", // Use secure cookies in production
		sameSite: "lax", // Adjust as needed: 'lax', 'strict', or 'none'
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	}),
	set: (
		res: Response,
		name: string,
		value: string,
		options: CookieOptions = {},
	) => {
		res.cookie(name, value, { ...cookie.getOptions(), ...options });
	},
	get: (req: Request, name: string) => {
		return req.cookies?.[name];
	},
	clear: (res: Response, name: string, options: CookieOptions = {}) => {
		res.clearCookie(name, { ...cookie.getOptions(), ...options });
	},
};

export default cookie;
