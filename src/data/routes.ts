export const ROUTES = {
  home: "/home",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  demoInbox: "/demo-inbox",
  inbox: "/inbox",
  cart: "/cart",
  checkout: "/checkout",
  profileOrders: "/profile?tab=orders"
} as const;

export const ROUTE_BUILDERS = {
  profileOrdersWithInvoice: (orderId: string): string =>
    `/profile?tab=orders&invoice=${encodeURIComponent(orderId)}`
} as const;

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toRoutePattern = (route: string): RegExp => new RegExp(`${escapeRegExp(route)}(?:[/?#].*)?$`);

export const ROUTE_MATCHERS = Object.freeze({
  home: toRoutePattern(ROUTES.home),
  login: toRoutePattern(ROUTES.login),
  checkout: toRoutePattern(ROUTES.checkout)
});
