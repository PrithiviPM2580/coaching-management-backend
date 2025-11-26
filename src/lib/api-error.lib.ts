// ============================================================
// 🧩 APIErrorLib — API error handling library
// ============================================================
class APIError extends Error {
	public readonly statusCode: number; // HTTP status code
	public readonly success: boolean; // Indicates if the operation was successful
	public readonly error?: APIErrorType; // Detailed error information

	// Constructor to initialize the APIError instance
	constructor(
		statusCode: number = 500,
		message: string = "Internal Server Error",
		error?: APIErrorType,
		stack?: string,
	) {
		// Initialize the APIError instance with provided details
		super(message); //
		this.name = this.constructor.name; // Name of the error class
		this.statusCode = statusCode; // HTTP status code
		this.success = false; // Indicates if the operation was successful
		this.error = error; // Detailed error information

		// Capture the stack trace for debugging purposes
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export default APIError;
