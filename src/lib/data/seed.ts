// ============================================================
// PC Center — Seed Data
// ============================================================
import type { User, Product, Category, Order, Review } from "./schema";

import usersData from "./mock/users.json";
import productsData from "./mock/products.json";
import categoriesData from "./mock/categories.json";
import ordersData from "./mock/orders.json";
import reviewsData from "./mock/reviews.json";

// Simple hash function for demo passwords
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return "hash_" + Math.abs(hash).toString(16);
}

export const seedUsers = usersData as User[];
export const seedProducts = productsData as unknown as Product[];
export const seedCategories = categoriesData as Category[];
export const seedOrders = ordersData as unknown as Order[];
export const seedReviews = reviewsData as Review[];


