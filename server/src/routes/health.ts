import { Router } from "express";
import { db } from "../lib/db.ts";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  console.log("Health check called");
  try {
    const count = await db.user.count();
    console.log("DB count:", count);
    res.json({ status: "ok", database: "connected", users: count, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Health check DB error:", error);
    res.status(503).json({ status: "error", database: "disconnected", timestamp: new Date().toISOString() });
  }
});
