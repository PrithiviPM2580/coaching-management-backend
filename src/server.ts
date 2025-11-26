import app from "@/app";
import config from "@/config/env.config";
import prisma from "@/config/prisma-client.config";
import logger from "@/lib/logger.lib";

// ------------------------------------------------------
// startServer() — Starts the Express server
// ------------------------------------------------------
const startServer = async () => {
	const PORT = config.PORT || 3001;

	// Start the server and listen on the specified port
	const server = app.listen(PORT, () => {
		logger.info(`Server is running on http://localhost:${PORT}`);
	});

	// ------------------------------------------------------
	// Graceful Shutdown
	// ------------------------------------------------------
	const shutdown = async (signal: string) => {
		try {
			logger.info(`Received ${signal}. Shutting down gracefully...`);

			// 1. Stop accepting new requests
			server.close(async () => {
				// 2. Disconnect Prisma
				await prisma.$disconnect();
				logger.info("Prisma disconnected. Server closed.");
				process.exit(0);
			});
		} catch (error) {
			logger.error("Error during shutdown", error);
			process.exit(1);
		}
	};

	// Handle signals
	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));
};

export default startServer;
