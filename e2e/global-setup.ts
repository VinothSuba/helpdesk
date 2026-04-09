import { execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";

export default async function globalSetup() {
  const envPath = path.resolve(__dirname, "../.env.test");
  const env = {
    ...process.env,
    ...dotenv.config({ path: envPath }).parsed,
  };

  const serverDir = path.resolve(__dirname, "../server");
  const bunPath = `${process.env.HOME}/.bun/bin`;
  const nvmNode22 = `${process.env.HOME}/.nvm/versions/node/v22.22.2/bin`;
  const opts = {
    cwd: serverDir,
    env: { ...env, PATH: `${bunPath}:${nvmNode22}:${env.PATH}` },
    stdio: "inherit" as const,
  };

  console.log("[e2e] Pushing Prisma schema to test database...");
  execSync("npx prisma db push", opts);

  console.log("[e2e] Seeding test database...");
  execSync("bun prisma/seed.ts", opts);

  console.log("[e2e] Global setup complete.");
}
