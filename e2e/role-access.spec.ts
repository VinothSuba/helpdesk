import { test, expect } from "@playwright/test";
import { loginAs, ADMIN, AGENT } from "./helpers.ts";

test.describe("Role-based access control", () => {
  test.describe("Admin role — page access", () => {
    test("admin can access /users page", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.goto("/users");

      await expect(page.getByRole("heading", { name: "Users" })).toBeVisible({ timeout: 10_000 });
    });

    test("admin can access dashboard at /", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.goto("/");

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });

    test("admin navigating to unknown route is redirected to dashboard", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.goto("/nonexistent");

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });
  });

  test.describe("Agent role — page access", () => {
    test("agent can access dashboard at /", async ({ page }) => {
      await loginAs(page, AGENT);
      await page.goto("/");

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });

    test("agent navigating to /users is redirected to dashboard", async ({ page }) => {
      await loginAs(page, AGENT);
      await page.goto("/users");

      // RequireRole redirects non-admin to /
      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10_000 });
      await expect(page.getByRole("heading", { name: "Users" })).not.toBeVisible();
    });

    test("agent navigating to unknown route is redirected to dashboard", async ({ page }) => {
      await loginAs(page, AGENT);
      await page.goto("/nonexistent");

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });
  });

  test.describe("NavBar — role-based link visibility", () => {
    test("admin sees Users link in navbar", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByRole("link", { name: "Users" })).toBeVisible();
    });

    test("admin sees Dashboard link in navbar", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    });

    test("agent sees Dashboard link in navbar", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    });

    test("agent does NOT see Users link in navbar", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByRole("link", { name: "Users" })).not.toBeVisible();
    });
  });

  test.describe("NavBar — user identity display", () => {
    test("admin sees their name and email in navbar", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByText(`${ADMIN.name} (${ADMIN.email})`)).toBeVisible();
    });

    test("agent sees their name and email in navbar", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByText(`${AGENT.name} (${AGENT.email})`)).toBeVisible();
    });
  });
});
