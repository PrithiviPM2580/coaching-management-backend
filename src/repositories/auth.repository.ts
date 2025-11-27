// ============================================================
// 🧩 AuthRepository — Handles authentication related database operations
// ============================================================

import prisma from "@/config/prisma-client.config";
import type { RegisterBody } from "@/validator/auth.validator";

// ------------------------------------------------------
// isUserExistsWithEmail() — Checks if a user exists with the given email
// ------------------------------------------------------
export const isUserExistsWithEmail = async (
	email: string,
): Promise<boolean> => {
	// Check for existing user with the provided email
	const user = await prisma.user.count({ where: { email } });
	// Return true if a user exists, otherwise false
	return user > 0;
};

// ------------------------------------------------------
// registerUser() — Registers a new user in the database
// ------------------------------------------------------
export const registerUser = async ({
	email,
	name,
	password,
	role,
}: RegisterBody) => {
	// Create and return the new user record
	return await prisma.user.create({
		data: {
			email,
			name,
			password,
			role: role || "staff",
		},
	});
};

// ------------------------------------------------------
// createToken() — Creates a new token record in the database
// ------------------------------------------------------
export const createToken = async (data: IToken) => {
	// Create and return the new token record
	return await prisma.token.create({
		data,
	});
};

// ------------------------------------------------------
// findUserByEmail() — Finds a user by their email address
// ------------------------------------------------------
export const findUserByEmail = async (email: string) => {
	// Find and return the user with the given email
	return await prisma.user.findUnique({ where: { email } });
};

// ------------------------------------------------------
// deleteRefreshToken() — Deletes a refresh token from the database
// ------------------------------------------------------
export const deleteRefreshToken = async (token: string) => {
	// Delete the token record and return the count of deleted records
	const result = await prisma.token.deleteMany({ where: { token } });

	// Return the number of deleted records
	return result.count;
};

// ------------------------------------------------------
// isTokenExists() — Checks if a token exists in the database
// ------------------------------------------------------
export const isTokenExists = async (oldToken: string): Promise<boolean> => {
	// Count the number of tokens matching the provided token
	const tokenCount = await prisma.token.count({ where: { token: oldToken } });

	// Return true if the token exists, otherwise false
	return tokenCount > 0;
};
