import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.ts";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const session = await auth.api.getSession({
    headers: req.headers as Headers,
  });

  if (!session) {
    res.status(401).json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } });
    return;
  }

  req.user = session.user;
  req.session = session.session;
  next();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: { message: "Forbidden", code: "FORBIDDEN" } });
    return;
  }
  next();
}
