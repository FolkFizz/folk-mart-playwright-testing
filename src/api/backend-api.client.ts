import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { ENV } from "../config/env";

type RequestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  expectedStatus?: number;
};

export class BackendApiClient {
  private readonly api: APIRequestContext;

  constructor(api: APIRequestContext) {
    this.api = api;
  }

  async get(path: string, expectedStatus = 200): Promise<any> {
    const response = await this.api.get(path);
    expect(response.status(), `GET ${path} status`).toBe(expectedStatus);
    return response.json();
  }

  async getResponse(path: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.api.get(path, { headers });
  }

  async post(path: string, options: RequestOptions = {}): Promise<any> {
    const response = await this.api.post(path, {
      data: options.body,
      headers: options.headers
    });
    expect(response.status(), `POST ${path} status`).toBe(options.expectedStatus ?? 200);
    return response.json();
  }

  async postResponse(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.api.post(path, {
      data: options.body,
      headers: options.headers
    });
  }

  async patch(path: string, options: RequestOptions = {}): Promise<any> {
    const response = await this.api.patch(path, {
      data: options.body,
      headers: options.headers
    });
    expect(response.status(), `PATCH ${path} status`).toBe(options.expectedStatus ?? 200);
    return response.json();
  }

  async delete(path: string, expectedStatus = 200): Promise<any> {
    const response = await this.api.delete(path);
    expect(response.status(), `DELETE ${path} status`).toBe(expectedStatus);
    return response.json();
  }

  async getHealth(): Promise<any> {
    return this.get("/health", 200);
  }

  async listProducts(query = ""): Promise<any> {
    const path = query ? `/api/products?${query}` : "/api/products";
    return this.get(path, 200);
  }

  async getFirstInStockProductId(): Promise<number> {
    const payload = await this.listProducts("sort=newest&limit=50");
    const product = Array.isArray(payload?.products)
      ? payload.products.find((item: any) => Number(item?.stock || 0) > 0)
      : null;

    expect(product, "Expected at least one product with stock > 0 for API flow").toBeTruthy();
    return Number(product.id);
  }

  async login(username: string, password: string, expectedStatus = 200): Promise<any> {
    return this.post("/api/auth/login", {
      body: { username, password },
      expectedStatus
    });
  }

  async logout(expectedStatus = 200): Promise<any> {
    return this.post("/api/auth/logout", { body: {}, expectedStatus });
  }

  async addCartItem(productId: number, quantity: number, expectedStatus = 200): Promise<any> {
    return this.post("/api/cart/add", {
      body: { productId, quantity },
      expectedStatus
    });
  }

  async applyCoupon(code: string, expectedStatus = 200): Promise<any> {
    return this.post("/api/cart/coupon", {
      body: { code },
      expectedStatus
    });
  }

  async authorizePayment(payload: { cardNumber: string; expMonth: string; expYear: string; cvv: string }, expectedStatus = 200): Promise<any> {
    return this.post("/api/orders/mock-provider/authorize", {
      body: payload,
      expectedStatus
    });
  }

  async placeOrder(payload: { paymentToken: string; name: string; email: string; address: string }, expectedStatus = 200): Promise<any> {
    return this.post("/api/orders/mock-pay", {
      body: payload,
      expectedStatus
    });
  }

  async getInvoice(orderId: string, expectedStatus = 200): Promise<any> {
    return this.get(`/api/orders/${encodeURIComponent(orderId)}/invoice`, expectedStatus);
  }

  async resetState(expectedStatus = 200): Promise<any> {
    return this.post("/api/test/reset", {
      body: {},
      headers: { "x-test-api-key": ENV.testApiKey },
      expectedStatus
    });
  }

  async resetAllProductStocks(stock?: number, expectedStatus = 200): Promise<any> {
    const body = Number.isFinite(Number(stock)) ? { stock } : {};
    return this.post("/api/test/reset-stock", {
      body,
      headers: { "x-test-api-key": ENV.testApiKey },
      expectedStatus
    });
  }

  async setProductStock(productId: number, stock: number, expectedStatus = 200): Promise<any> {
    return this.post("/api/test/set-stock", {
      body: { productId, stock },
      headers: { "x-test-api-key": ENV.testApiKey },
      expectedStatus
    });
  }
}
