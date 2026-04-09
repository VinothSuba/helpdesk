import { test, expect } from "@playwright/test";
import { loginAs, ADMIN, AGENT } from "./helpers.ts";

test.describe("Users page", () => {
  test.describe("Admin access", () => {
    test("admin sees Users page heading", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.getByRole("link", { name: "Users" }).click();

      await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    });

    test("admin navigating directly to /users sees the page", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.goto("/users");

      await expect(page.getByRole("heading", { name: "Users" })).toBeVisible({ timeout: 10_000 });
    });

    test("admin sees user management placeholder content", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.goto("/users");

      await expect(page.getByText("User management coming soon")).toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe("Agent access — blocked", () => {
    test("agent navigating to /users is redirected to dashboard", async ({ page }) => {
      await loginAs(page, AGENT);
      await page.goto("/users");

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10_000 });
    });

    test("agent does not see Users page content", async ({ page }) => {
      await loginAs(page, AGENT);
      await page.goto("/users");

      await expect(page.getByRole("heading", { name: "Users" })).not.toBeVisible();
      await expect(page.getByText("User management coming soon")).not.toBeVisible();
    });
  });
});
