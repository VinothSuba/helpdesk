import { test, expect } from "@playwright/test";
import { loginAs, ADMIN, AGENT } from "./helpers.ts";

test.describe("Navigation", () => {
  test.describe("NavBar — admin", () => {
    test("brand heading 'Helpdesk' is visible", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByRole("heading", { name: "Helpdesk" })).toBeVisible();
    });

    test("Dashboard nav link navigates to /", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.goto("/users");
      await page.getByRole("link", { name: "Dashboard" }).click();

      await expect(page).toHaveURL("/");
      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });

    test("Users nav link navigates to /users", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.getByRole("link", { name: "Users" }).click();

      await expect(page).toHaveURL("/users");
      await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    });

    test("Sign out button is visible", async ({ page }) => {
      await loginAs(page, ADMIN);

      await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
    });
  });

  test.describe("NavBar — agent", () => {
    test("brand heading 'Helpdesk' is visible", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByRole("heading", { name: "Helpdesk" })).toBeVisible();
    });

    test("Dashboard nav link navigates to /", async ({ page }) => {
      await loginAs(page, AGENT);
      await page.getByRole("link", { name: "Dashboard" }).click();

      await expect(page).toHaveURL("/");
      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });

    test("Users nav link is not present for agent", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByRole("link", { name: "Users" })).not.toBeVisible();
    });

    test("Sign out button is visible", async ({ page }) => {
      await loginAs(page, AGENT);

      await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
    });
  });

  test.describe("NavBar — active link state", () => {
    test("Dashboard link is active when on /", async ({ page }) => {
      await loginAs(page, ADMIN);

      const dashLink = page.getByRole("link", { name: "Dashboard" });
      // Active class applies font-medium text-foreground (not muted)
      await expect(dashLink).toHaveClass(/font-medium/);
    });

    test("Users link is active when on /users", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.goto("/users");

      const usersLink = page.getByRole("link", { name: "Users" });
      await expect(usersLink).toHaveClass(/font-medium/);
    });

    test("Dashboard link is not active when on /users", async ({ page }) => {
      await loginAs(page, ADMIN);
      await page.goto("/users");

      const dashLink = page.getByRole("link", { name: "Dashboard" });
      await expect(dashLink).not.toHaveClass(/font-medium/);
    });
  });

  test.describe("Login page — no navbar", () => {
    test("navbar is not present on login page", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("heading", { name: "Helpdesk" })).not.toBeVisible();
      await expect(page.getByRole("link", { name: "Dashboard" })).not.toBeVisible();
    });
  });
});
