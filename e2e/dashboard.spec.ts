import { test, expect } from "@playwright/test";
import { loginAs, ADMIN, AGENT } from "./helpers.ts";

test.describe("Dashboard page", () => {
  test.describe("Admin view", () => {
    test("admin sees dashboard heading", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });

    test("admin sees welcome message", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByText("Welcome back")).toBeVisible();
    });

    test("admin dashboard URL is /", async ({ page }) => {
      await loginAs(page, ADMIN);

      expect(page.url()).toMatch(/\/$/);
    });
  });

  test.describe("Agent view", () => {
    test("agent sees dashboard heading", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });

    test("agent sees welcome message", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByText("Welcome back")).toBeVisible();
    });

    test("agent dashboard URL is /", async ({ page }) => {
      await loginAs(page, AGENT);

      expect(page.url()).toMatch(/\/$/);
    });
  });
});
