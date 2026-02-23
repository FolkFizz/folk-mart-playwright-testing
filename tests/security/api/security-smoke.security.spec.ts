import { expect, test } from "../../../src/fixtures/test-fixtures";
import { USERS } from "../../../src/data/users";

test.describe("SECURITY SMOKE :: API", () => {
  
  test.describe("positive cases", () => {
    test(
      "SECAPI-P01: security headers and session cookie flags are present @security @smoke @critical @safe @auth",
      async ({ apiClient }) => {
        const health = await apiClient.getResponse("/health");

        expect(health.headers()["x-content-type-options"]).toBe("nosniff");
        expect(health.headers()["x-frame-options"]).toBeTruthy();

        const login = await apiClient.postResponse("/api/auth/login", {
          body: {
            username: USERS.standard.username,
            password: USERS.standard.password
          }
        });

        expect(login.status()).toBe(200);
        const setCookie = login.headers()["set-cookie"] || "";
        expect(setCookie).toContain("HttpOnly");
        expect(setCookie).toContain("SameSite");
      }
    );
  });

  test.describe("negative cases", () => {
    test(
      "SECAPI-N01: CORS rejects requests from unknown origin @security @critical @safe @catalog",
      async ({ apiClient }) => {
        const response = await apiClient.getResponse("/api/products", {
          Origin: "https://evil.example.com"
        });

        expect(response.status()).toBe(500);
        const payload = await response.json();
        expect(String(payload.message)).toMatch(/origin not allowed by cors/i);
      }
    );

    test(
      "SECAPI-N02: private orders API requires authentication @security @critical @safe @orders",
      async ({ apiClient }) => {
        const payload = await apiClient.get("/api/orders", 401);

        expect(payload.ok).toBeFalsy();
        expect(String(payload.message)).toMatch(/authentication required/i);
      }
    );
  });

  test.describe("edge cases", () => {
    test(
      "SECAPI-E01: request without Origin header is accepted for server clients @security @regression @safe @catalog",
      async ({ apiClient }) => {
        const response = await apiClient.getResponse("/api/products");

        expect(response.status()).toBe(200);
        const payload = await response.json();
        expect(payload.ok).toBeTruthy();
      }
    );
  });
});
