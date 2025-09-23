import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClient = () => {
    // Use PostgreSQL adapter for serverless environments
    if (process.env.NODE_ENV === "production") {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    }
    // Use standard client for development
    return new PrismaClient();
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClient>;
}

const prisma = globalThis.prisma ?? prismaClient();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;