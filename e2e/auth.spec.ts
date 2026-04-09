import { test, expect } from "@playwright/test";
import { loginAs, ADMIN, AGENT } from "./helpers.ts";

test.describe("Authentication flows", () => {
  test.describe("Login page — unauthenticated state", () => {
    test("unauthenticated user sees login page", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Sign in to your account")).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    });

    test("unauthenticated user navigating to /users sees login page", async ({ page }) => {
      await page.goto("/users");
      await expect(page.getByText("Sign in to your account")).toBeVisible();
    });
  });

  test.describe("Login — valid credentials", () => {
    test("admin logs in and sees dashboard", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
      await expect(page.getByText("Welcome back")).toBeVisible();
    });

    test("agent logs in and sees dashboard", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
      await expect(page.getByText("Welcome back")).toBeVisible();
    });

    test("login page disappears after successful login", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByText("Sign in to your account")).not.toBeVisible();
    });
  });

  test.describe("Login — invalid credentials", () => {
    test("wrong password shows error message", async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Email").fill(ADMIN.email);
      await page.getByLabel("Password").fill("wrongpassword");
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page.locator(".text-destructive, [class*='destructive']").first())
        .toBeVisible({ timeout: 10_000 });
      // Still on login page
      await expect(page.getByText("Sign in to your account")).toBeVisible();
    });

    test("non-existent email shows error message", async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Email").fill("nobody@helpdesk.com");
      await page.getByLabel("Password").fill("somepassword");
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page.locator(".text-destructive, [class*='destructive']").first())
        .toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe("Login — client-side validation", () => {
    test("empty email field shows validation error", async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Password").fill("somepassword");
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page.getByText("Enter a valid email address")).toBeVisible();
    });

    test("invalid email format shows validation error", async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Email").fill("not-an-email");
      await page.getByLabel("Password").fill("somepassword");
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page.getByText("Enter a valid email address")).toBeVisible();
    });

    test("password shorter than 6 chars shows validation error", async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Email").fill(ADMIN.email);
      await page.getByLabel("Password").fill("12345");
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
    });

    test("empty form shows both validation errors", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page.getByText("Enter a valid email address")).toBeVisible();
      await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
    });
  });

  test.describe("Logout", () => {
    test("admin can sign out and is shown login page", async ({ page }) => {
      await loginAs(page, ADMIN);

      await page.getByRole("button", { name: "Sign out" }).click();

      await expect(page.getByText("Sign in to your account")).toBeVisible({ timeout: 10_000 });
    });

    test("agent can sign out and is shown login page", async ({ page }) => {
      await loginAs(page, AGENT);

      await page.getByRole("button", { name: "Sign out" }).click();

      await expect(page.getByText("Sign in to your account")).toBeVisible({ timeout: 10_000 });
    });

    test("after sign out, navigating to app shows login page", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.getByRole("button", { name: "Sign out" }).click();
      await expect(page.getByText("Sign in to your account")).toBeVisible({ timeout: 10_000 });

      await page.goto("/");
      await expect(page.getByText("Sign in to your account")).toBeVisible();
    });
  });

  test.describe("Session persistence", () => {
    test("admin session survives page reload", async ({ page }) => {
      await loginAs(page, ADMIN);

      await page.reload();

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
        timeout: 15_000,
      });
    });

    test("agent session survives page reload", async ({ page }) => {
      await loginAs(page, AGENT);

      await page.reload();

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
        timeout: 15_000,
      });
    });
  });
});
