export const TAGS = {
  testType: {
    e2e: "@e2e",
    api: "@api",
    integration: "@integration",
    a11y: "@a11y",
    security: "@security"
  },
  executionScope: {
    smoke: "@smoke",
    regression: "@regression",
    critical: "@critical"
  },
  dataImpact: {
    safe: "@safe",
    destructive: "@destructive",
    seeded: "@seeded"
  },
  businessArea: {
    auth: "@auth",
    catalog: "@catalog",
    cart: "@cart",
    checkout: "@checkout",
    orders: "@orders"
  },
  caseStyle: {
    positive: "@positive",
    negative: "@negative",
    edge: "@edge"
  },
  owner: {
    folk: "@owner-folk"
  }
} as const;

export const tags = (...values: string[]): string => values.join(" ");
