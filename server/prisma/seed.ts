import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function seed() {
  const existingAdmin = await db.user.findFirst({
    where: { role: "admin" },
  });

  if (existingAdmin) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }

  const { betterAuth } = await import("better-auth");
  const { prismaAdapter } = await import("better-auth/adapters/prisma");

  const auth = betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: true },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "agent",
          input: false,
        },
      },
    },
  });

  const ctx = await auth.api.signUpEmail({
    body: {
      email: "admin@helpdesk.com",
      password: "admin123",
      name: "Admin",
    },
  });

  await db.user.update({
    where: { id: ctx.user.id },
    data: { role: "admin" },
  });

  console.log(`Default admin created: admin@helpdesk.com`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
