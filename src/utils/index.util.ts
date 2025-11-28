// ============================================================
// 🧩 Utility — Utility functions and helpers
// ============================================================

import bcrypt from "bcrypt";
import type { Response } from "express";
import PDFDocument from "pdfkit";
import logger from "@/lib/logger.lib";
import APIError from "@/lib/api-error.lib";

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

// ------------------------------------------------------
// studentDueAmount() — Calculates the due amount for a student
// ------------------------------------------------------
export const studentDueAmount = (
	dueAmount: number,
	amountPaid: number,
): number => {
	if (amountPaid > dueAmount) {
		logger.error("Amount paid exceeds due amount", {
			label: "studentDueAmount",
		});
		throw new APIError(400, "Amount paid exceeds due amount", {
			type: "BadRequest",
			details: [
				{
					field: "amountPaid",
					message: "Amount paid cannot be greater than due amount",
				},
			],
		});
	}

	return dueAmount - amountPaid;
};

// ------------------------------------------------------
// generateReceiptNumber() — Generates a unique receipt number
// ------------------------------------------------------
export const generateReceiptNumber = (): string => {
	const timestamp = Date.now().toString(); // Current timestamp
	const randomNum = Math.floor(1000 + Math.random() * 9000).toString(); // Random 4-digit number
	return `RCPT-${timestamp}-${randomNum}`;
};

// ------------------------------------------------------
// generatePDF() — Generates a PDF document
// ------------------------------------------------------
export const generatePDF = (
	payment: FeePayment,
	paymentId: number,
	res: Response,
) => {
	const doc = new PDFDocument();

	res.setHeader("Content-Type", "application/pdf");
	res.setHeader(
		"Content-Disposition",
		`attachment; filename=receipt-${paymentId}.pdf`,
	);

	doc.pipe(res);

	doc.fontSize(20).text("Payment Receipt", { align: "center" });
	doc.moveDown();

	doc.fontSize(12).text(`Receipt No: ${payment.receipt_no}`);
	doc.text(`Student: ${payment.student.name}`);
	doc.text(`Batch: ${payment.batch.batch_name}`);
	doc.text(`Amount Paid: Rs. ${payment.amount_paid}`);
	doc.text(`Mode: ${payment.mode}`);
	doc.text(`Date: ${payment.date.toDateString()}`);

	doc.end();
};
