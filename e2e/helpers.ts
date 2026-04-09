import type { Page, APIRequestContext } from "@playwright/test";

export const ADMIN = {
  email: "admin@helpdesk.com",
  password: "admin123",
  name: "Admin",
  role: "admin",
} as const;

export const AGENT = {
  email: "agent@helpdesk.com",
  password: "agent123",
  name: "Agent",
  role: "agent",
} as const;

export const BASE_URL = "http://localhost:3001";

export async function loginAs(page: Page, user: typeof ADMIN | typeof AGENT) {
  await page.goto("/");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait for the navbar to appear — indicates successful auth and session load
  await page.getByRole("heading", { name: "Dashboard" }).waitFor({ timeout: 15_000 });
}

export async function getSessionCookie(
  request: APIRequestContext,
  user: typeof ADMIN | typeof AGENT,
): Promise<string> {
  const response = await request.post(`${BASE_URL}/api/auth/sign-in/email`, {
    data: { email: user.email, password: user.password },
    headers: { "Content-Type": "application/json" },
  });

  const setCookie = response.headers()["set-cookie"] ?? "";
  // Extract the session token cookie value
  const match = setCookie.match(/better-auth\.session_token=([^;]+)/);
  return match ? `better-auth.session_token=${match[1]}` : "";
}
