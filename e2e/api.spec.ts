import { test, expect } from "@playwright/test";
import { ADMIN, AGENT, BASE_URL } from "./helpers.ts";

const API = BASE_URL;

async function signIn(
  request: import("@playwright/test").APIRequestContext,
  user: typeof ADMIN | typeof AGENT,
) {
  const response = await request.post(`${API}/api/auth/sign-in/email`, {
    data: { email: user.email, password: user.password },
    headers: { "Content-Type": "application/json" },
  });
  expect(response.status()).toBe(200);
  return response;
}

test.describe("API — Health check", () => {
  test("GET /api/health returns ok status", async ({ request }) => {
    const response = await request.get(`${API}/api/health`);

    expect(response.status()).toBe(200);
    const body = await response.json() as Record<string, unknown>;
    expect(body.status).toBe("ok");
  });

  test("GET /api/health returns database connected", async ({ request }) => {
    const response = await request.get(`${API}/api/health`);
    const body = await response.json() as Record<string, unknown>;

    expect(body.database).toBe("connected");
  });

  test("GET /api/health returns a timestamp", async ({ request }) => {
    const response = await request.get(`${API}/api/health`);
    const body = await response.json() as Record<string, unknown>;

    expect(typeof body.timestamp).toBe("string");
    expect(new Date(body.timestamp as string).getTime()).not.toBeNaN();
  });

  test("GET /api/health returns user count", async ({ request }) => {
    const response = await request.get(`${API}/api/health`);
    const body = await response.json() as Record<string, unknown>;

    expect(typeof body.users).toBe("number");
    expect(body.users as number).toBeGreaterThan(0);
  });
});

test.describe("API — Users endpoint", () => {
  test.describe("Unauthenticated", () => {
    test("GET /api/users without session returns 401", async ({ request }) => {
      const response = await request.get(`${API}/api/users`);

      expect(response.status()).toBe(401);
    });

    test("GET /api/users without session returns UNAUTHORIZED code", async ({ request }) => {
      const response = await request.get(`${API}/api/users`);
      const body = await response.json() as Record<string, unknown>;

      expect((body.error as Record<string, unknown>).code).toBe("UNAUTHORIZED");
    });
  });

  test.describe("Authenticated as agent", () => {
    test("GET /api/users as agent returns 403", async ({ request }) => {
      const signInResponse = await signIn(request, AGENT);
      const cookie = signInResponse.headers()["set-cookie"] ?? "";

      const response = await request.get(`${API}/api/users`, {
        headers: { Cookie: cookie },
      });

      expect(response.status()).toBe(403);
    });

    test("GET /api/users as agent returns FORBIDDEN code", async ({ request }) => {
      const signInResponse = await signIn(request, AGENT);
      const cookie = signInResponse.headers()["set-cookie"] ?? "";

      const response = await request.get(`${API}/api/users`, {
        headers: { Cookie: cookie },
      });
      const body = await response.json() as Record<string, unknown>;

      expect((body.error as Record<string, unknown>).code).toBe("FORBIDDEN");
    });
  });

  test.describe("Authenticated as admin", () => {
    test("GET /api/users as admin returns 200", async ({ request }) => {
      const signInResponse = await signIn(request, ADMIN);
      const cookie = signInResponse.headers()["set-cookie"] ?? "";

      const response = await request.get(`${API}/api/users`, {
        headers: { Cookie: cookie },
      });

      expect(response.status()).toBe(200);
    });

    test("GET /api/users as admin returns data array", async ({ request }) => {
      const signInResponse = await signIn(request, ADMIN);
      const cookie = signInResponse.headers()["set-cookie"] ?? "";

      const response = await request.get(`${API}/api/users`, {
        headers: { Cookie: cookie },
      });
      const body = await response.json() as Record<string, unknown>;

      expect(Array.isArray(body.data)).toBe(true);
    });

    test("GET /api/users returns admin user in results", async ({ request }) => {
      const signInResponse = await signIn(request, ADMIN);
      const cookie = signInResponse.headers()["set-cookie"] ?? "";

      const response = await request.get(`${API}/api/users`, {
        headers: { Cookie: cookie },
      });
      const body = await response.json() as { data: Array<Record<string, unknown>> };

      const adminUser = body.data.find((u) => u.email === ADMIN.email);
      expect(adminUser).toBeDefined();
      expect(adminUser?.role).toBe("admin");
    });

    test("GET /api/users returns agent user in results", async ({ request }) => {
      const signInResponse = await signIn(request, ADMIN);
      const cookie = signInResponse.headers()["set-cookie"] ?? "";

      const response = await request.get(`${API}/api/users`, {
        headers: { Cookie: cookie },
      });
      const body = await response.json() as { data: Array<Record<string, unknown>> };

      const agentUser = body.data.find((u) => u.email === AGENT.email);
      expect(agentUser).toBeDefined();
      expect(agentUser?.role).toBe("agent");
    });

    test("GET /api/users does not expose passwords", async ({ request }) => {
      const signInResponse = await signIn(request, ADMIN);
      const cookie = signInResponse.headers()["set-cookie"] ?? "";

      const response = await request.get(`${API}/api/users`, {
        headers: { Cookie: cookie },
      });
      const body = await response.json() as { data: Array<Record<string, unknown>> };

      for (const user of body.data) {
        expect(user.password).toBeUndefined();
      }
    });

    test("GET /api/users returns expected fields per user", async ({ request }) => {
      const signInResponse = await signIn(request, ADMIN);
      const cookie = signInResponse.headers()["set-cookie"] ?? "";

      const response = await request.get(`${API}/api/users`, {
        headers: { Cookie: cookie },
      });
      const body = await response.json() as { data: Array<Record<string, unknown>> };

      expect(body.data.length).toBeGreaterThan(0);
      const user = body.data[0];
      expect(typeof user?.id).toBe("string");
      expect(typeof user?.email).toBe("string");
      expect(typeof user?.name).toBe("string");
      expect(typeof user?.role).toBe("string");
      expect(typeof user?.createdAt).toBe("string");
      expect(typeof user?.updatedAt).toBe("string");
    });
  });
});

test.describe("API — Auth endpoints", () => {
  test("POST /api/auth/sign-in/email with valid admin credentials returns 200", async ({
    request,
  }) => {
    const response = await request.post(`${API}/api/auth/sign-in/email`, {
      data: { email: ADMIN.email, password: ADMIN.password },
      headers: { "Content-Type": "application/json" },
    });

    expect(response.status()).toBe(200);
  });

  test("POST /api/auth/sign-in/email with valid agent credentials returns 200", async ({
    request,
  }) => {
    const response = await request.post(`${API}/api/auth/sign-in/email`, {
      data: { email: AGENT.email, password: AGENT.password },
      headers: { "Content-Type": "application/json" },
    });

    expect(response.status()).toBe(200);
  });

  test("POST /api/auth/sign-in/email with wrong password returns error", async ({ request }) => {
    const response = await request.post(`${API}/api/auth/sign-in/email`, {
      data: { email: ADMIN.email, password: "wrongpassword" },
      headers: { "Content-Type": "application/json" },
    });

    expect(response.status()).not.toBe(200);
  });

  test("POST /api/auth/sign-up/email is disabled — returns error", async ({ request }) => {
    const response = await request.post(`${API}/api/auth/sign-up/email`, {
      data: {
        email: "newuser@helpdesk.com",
        password: "newpassword123",
        name: "New User",
      },
      headers: { "Content-Type": "application/json" },
    });

    // disableSignUp: true — Better Auth returns 422 or similar error
    expect(response.status()).not.toBe(200);
  });
});
