// ============================================================
// 🔹PrimaConfig — Prisma Client Configuration
// ============================================================
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import config from "@/config/env.config";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaMariaDb({
	host: config.DB_HOST,
	port: config.DB_PORT,
	user: config.DB_USER,
	password: config.DB_PASSWORD,
	database: config.DB_NAME,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
