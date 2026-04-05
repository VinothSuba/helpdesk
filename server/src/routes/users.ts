import { Router } from "express";
import { db } from "../lib/db.ts";
import { requireAuth, requireAdmin } from "../middleware/auth.ts";

export const usersRouter = Router();

usersRouter.use(requireAuth, requireAdmin);

usersRouter.get("/", async (_req, res) => {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: users });
});
