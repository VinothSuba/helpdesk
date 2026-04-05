import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";
import { healthRouter } from "./routes/health.ts";
import { usersRouter } from "./routes/users.ts";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({
  origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  credentials: true,
}));

const authHandler = toNodeHandler(auth);
app.all("/api/auth/*splat", (req, res) => authHandler(req, res));

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
