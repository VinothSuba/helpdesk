import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function seed() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const agentPassword = process.env.SEED_AGENT_PASSWORD;
  if (!adminPassword || !agentPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD and SEED_AGENT_PASSWORD must be set",
    );
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

  const existingAdmin = await db.user.findFirst({
    where: { role: "admin" },
  });

  if (!existingAdmin) {
    const ctx = await auth.api.signUpEmail({
      body: {
        email: "admin@helpdesk.com",
        password: adminPassword,
        name: "Admin",
      },
    });

    await db.user.update({
      where: { id: ctx.user.id },
      data: { role: "admin" },
    });

    console.log("Default admin created: admin@helpdesk.com");
  } else {
    console.log("Admin user already exists, skipping.");
  }

  const existingAgent = await db.user.findFirst({
    where: { email: "agent@helpdesk.com" },
  });

  if (!existingAgent) {
    await auth.api.signUpEmail({
      body: {
        email: "agent@helpdesk.com",
        password: agentPassword,
        name: "Agent",
      },
    });
    console.log("Default agent created: agent@helpdesk.com");
  } else {
    console.log("Agent user already exists, skipping.");
  }
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
