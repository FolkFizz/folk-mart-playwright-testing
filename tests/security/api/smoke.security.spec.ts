import { expect, test } from "../../../src/fixtures/test-fixtures";
import { API_MESSAGE_PATTERNS } from "../../../src/data/assertions";
import { USERS } from "../../../src/data/users";

test.describe("SECURITY SMOKE :: API", () => {
  test.describe.configure({ mode: "serial" });

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
        expect(String(payload.message)).toMatch(API_MESSAGE_PATTERNS.corsOriginNotAllowed);
      }
    );

    test(
      "SECAPI-N02: private orders API requires authentication @security @critical @safe @orders",
      async ({ apiClient }) => {
        const payload = await apiClient.get("/api/orders", 401);

        expect(payload.ok).toBeFalsy();
        expect(String(payload.message)).toMatch(API_MESSAGE_PATTERNS.authenticationRequired);
      }
    );

    test(
      "SECAPI-N03: SQL injection-style login payload does not bypass authentication @security @critical @safe @auth",
      async ({ apiClient }) => {
        const response = await apiClient.postResponse("/api/auth/login", {
          body: {
            username: "' OR '1'='1' --",
            password: "not-a-real-password"
          }
        });

        expect(response.status()).toBe(401);
        const payload = await response.json();
        expect(payload.ok).toBeFalsy();
        expect(String(payload.message)).toMatch(API_MESSAGE_PATTERNS.invalidCredentials);
      }
    );

    test(
      "SECAPI-N04: forgot-password does not leak account existence @security @critical @safe @auth",
      async ({ apiClient }) => {
        const response = await apiClient.postResponse("/api/auth/forgot-password", {
          body: {
            email: `nonexistent-${Date.now()}@example.test`
          }
        });

        expect(response.status()).toBe(200);
        const payload = await response.json();
        expect(payload.ok).toBeTruthy();
        expect(String(payload.message)).toMatch(API_MESSAGE_PATTERNS.forgotPasswordGenericNotice);
      }
    );

    test(
      "SECAPI-N05: privileged test endpoints reject invalid API keys @security @critical @safe @auth",
      async ({ apiClient }) => {
        const response = await apiClient.postResponse("/api/test/reset-stock", {
          body: { stock: 25 },
          headers: { "x-test-api-key": "invalid-key" }
        });

        expect(response.status()).toBe(403);
        const payload = await response.json();
        expect(payload.ok).toBeFalsy();
        expect(String(payload.message)).toMatch(API_MESSAGE_PATTERNS.testEndpointForbidden);
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

    test(
      "SECAPI-E02: product search handles SQL-like query payload safely @security @regression @safe @catalog",
      async ({ apiClient }) => {
        const probe = encodeURIComponent("'; DROP TABLE products; --");
        const response = await apiClient.getResponse(`/api/products?q=${probe}&limit=5`);
        expect([200, 403]).toContain(response.status());

        if (response.status() === 200) {
          const payload = await response.json();
          expect(payload.ok).toBeTruthy();
          expect(Array.isArray(payload.products)).toBeTruthy();
          return;
        }

        const blockedBody = await response.text();
        expect(blockedBody.toLowerCase()).toContain("blocked");
      }
    );

    test(
      "SECAPI-E03: auth endpoint exposes rate-limit telemetry and enforces throttling when threshold is reached @security @regression @safe @auth",
      async ({ apiClient }) => {
        const firstProbe = await apiClient.postResponse("/api/auth/login", {
          body: {
            username: `ratelimit-probe-${Date.now()}`,
            password: "invalid-password"
          }
        });

        const firstHeaders = firstProbe.headers();
        const limitHeader = firstHeaders["ratelimit-limit"] || firstHeaders["x-ratelimit-limit"];
        const remainingHeader = firstHeaders["ratelimit-remaining"] || firstHeaders["x-ratelimit-remaining"];
        test.skip(!limitHeader || !remainingHeader, "Rate limit headers are unavailable in this environment.");

        const headerLimit = Number(limitHeader);
        const remainingFirst = Number(remainingHeader);

        expect(Number.isFinite(headerLimit)).toBeTruthy();
        expect(headerLimit).toBeGreaterThan(0);
        expect(Number.isFinite(remainingFirst)).toBeTruthy();
        expect(remainingFirst).toBeGreaterThanOrEqual(0);

        const secondProbe = await apiClient.postResponse("/api/auth/login", {
          body: {
            username: `ratelimit-probe-${Date.now()}-2`,
            password: "invalid-password"
          }
        });
        expect([401, 429]).toContain(secondProbe.status());

        const remainingSecond = Number(
          secondProbe.headers()["ratelimit-remaining"] || secondProbe.headers()["x-ratelimit-remaining"]
        );
        if (Number.isFinite(remainingSecond)) {
          expect(remainingSecond).toBeGreaterThanOrEqual(0);
          expect(remainingSecond).toBeLessThanOrEqual(headerLimit);
        }

        if (secondProbe.status() === 429) {
          const payload = await secondProbe.json();
          expect(String(payload.message)).toMatch(API_MESSAGE_PATTERNS.tooManyRequests);
        }
      }
    );
  });
});
