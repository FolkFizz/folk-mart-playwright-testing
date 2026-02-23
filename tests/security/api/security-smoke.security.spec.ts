import { expect, test } from "../../../src/fixtures/test-fixtures";
import { TAGS, tags } from "../../../src/data/tags";
import { USERS } from "../../../src/data/users";

test.describe("SECURITY SMOKE :: API", () => {
  test.describe("negative cases", () => {
    test(
      `SECAPI-N01: CORS rejects requests from unknown origin ${tags(
        TAGS.testType.security,
        TAGS.executionScope.critical,
        TAGS.caseStyle.negative,
        TAGS.dataImpact.safe,
        TAGS.businessArea.catalog,
        TAGS.owner.folk
      )}`,
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
      `SECAPI-N02: private orders API requires authentication ${tags(
        TAGS.testType.security,
        TAGS.executionScope.critical,
        TAGS.caseStyle.negative,
        TAGS.dataImpact.safe,
        TAGS.businessArea.orders,
        TAGS.owner.folk
      )}`,
      async ({ apiClient }) => {
        const payload = await apiClient.get("/api/orders", 401);

        expect(payload.ok).toBeFalsy();
        expect(String(payload.message)).toMatch(/authentication required/i);
      }
    );
  });

  test.describe("positive cases", () => {
    test(
      `SECAPI-P01: security headers and session cookie flags are present ${tags(
        TAGS.testType.security,
        TAGS.executionScope.smoke,
        TAGS.executionScope.critical,
        TAGS.caseStyle.positive,
        TAGS.dataImpact.safe,
        TAGS.businessArea.auth,
        TAGS.owner.folk
      )}`,
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
});
