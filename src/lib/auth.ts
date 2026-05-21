import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString })) });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_google_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_google_secret",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "placeholder_github_id",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "placeholder_github_secret",
        },
    },
    trustedProxyHeaders: true,
    trustedOrigins: [
        process.env.BETTER_AUTH_URL?.replace(/\/$/, "") as string,
    ].filter(Boolean),
    baseURL: process.env.BETTER_AUTH_URL?.replace(/\/$/, ""),
});
