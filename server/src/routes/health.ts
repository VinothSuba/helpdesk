import { Router } from "express";
import { db } from "../lib/db.ts";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Health check DB error:", message);
    res.status(503).json({ status: "error", timestamp: new Date().toISOString() });
  }
});
