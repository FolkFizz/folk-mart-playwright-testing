export const API_QUERIES = {
  productsSmoke: "sort=price_asc&limit=5",
  productsFilterByCategory: "category=fragrances&sort=price_desc&limit=10",
  productsReversedPriceRange: "minPrice=120&maxPrice=10&limit=5"
} as const;
