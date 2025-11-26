// ============================================================
// 🧩 Utility — Utility functions and helpers
// ============================================================

import bcrypt from "bcrypt";
import type { Response } from "express";
import logger from "@/lib/logger.lib";

// ------------------------------------------------------
// successResponse() — Sends a standardized success response
// ------------------------------------------------------
export const successResponse = <T>(
	res: Response,
	statusCode: number = 200,
	message: string = "Success",
	data?: T,
) => {
	// Log the success response
	logger.info(`${message}`, {
		statusCode,
		data,
	});

	// Send the response
	return res.status(statusCode).json({
		success: true,
		statusCode,
		message,
		data,
	});
};

// ------------------------------------------------------
// hashPassword() — Hashes a password using bcrypt
// ------------------------------------------------------
export const hashPassword = async (
	password: string,
	saltRounds: number,
): Promise<string> => {
	// Generate salt and hash the password
	const salt = await bcrypt.genSalt(saltRounds);

	// Return the hashed password
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

// ------------------------------------------------------
// comparePasswords() — Compares a plain text password with a hashed password
// ------------------------------------------------------
export const comparePasswords = (
	plainPassword: string, // plain text password
	hashedPassword: string, // hashed password
): Promise<boolean> => {
	// Compare the plain password with the hashed password
	return bcrypt.compare(plainPassword, hashedPassword);
};

// ------------------------------------------------------
// sevenDaysFromNow() — Returns the date seven days from now
// ------------------------------------------------------
export const sevenDaysFromNow = () => {
	// Calculate and return the date seven days from now
	return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};
