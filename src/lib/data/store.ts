// ============================================================
// PC Center — LocalStorage Data Store
// ============================================================
import type {
  User, Product, Category, Order, Cart, Review,
} from "./schema";
import {
  seedUsers, seedProducts, seedCategories, seedOrders,
  seedReviews,
} from "./seed";
import { encryptData, decryptData } from "../encryption";

const STORAGE_KEYS = {
  users: "pc_center_users",
  products: "pc_center_products",
  categories: "pc_center_categories",
  orders: "pc_center_orders",
  carts: "pc_center_carts",
  reviews: "pc_center_reviews",
  initialized: "pc_center_initialized",
} as const;

type StoreKey = keyof typeof STORAGE_KEYS;

// Check if we're in browser
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Generic CRUD on LocalStorage
function getCollection<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(key);
    return data ? (decryptData(data) as T[]) || [] : [];
  } catch {
    return [];
  }
}

function setCollection<T>(key: string, data: T[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, encryptData(data));
}

// Initialize seed data if not already done
export function initializeStore(): void {
  if (!isBrowser()) return;
  const initialized = localStorage.getItem(STORAGE_KEYS.initialized);
  if (initialized) return;

  setCollection(STORAGE_KEYS.users, seedUsers);
  setCollection(STORAGE_KEYS.products, seedProducts);
  setCollection(STORAGE_KEYS.categories, seedCategories);
  setCollection(STORAGE_KEYS.orders, seedOrders);
  setCollection(STORAGE_KEYS.carts, []);
  setCollection(STORAGE_KEYS.reviews, seedReviews);

  localStorage.setItem(STORAGE_KEYS.initialized, "true");
}

// Force re-seed (for reset)
export function resetStore(): void {
  if (!isBrowser()) return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  initializeStore();
}

// ============================================================
// Users
// ============================================================
export const UserStore = {
  getAll: (): User[] => getCollection<User>(STORAGE_KEYS.users),
  getById: (id: string): User | undefined =>
    getCollection<User>(STORAGE_KEYS.users).find((u) => u.id === id),
  getByEmail: (email: string): User | undefined =>
    getCollection<User>(STORAGE_KEYS.users).find((u) => u.email === email),
  create: (user: User): User => {
    const users = getCollection<User>(STORAGE_KEYS.users);
    users.push(user);
    setCollection(STORAGE_KEYS.users, users);
    return user;
  },
  update: (id: string, updates: Partial<User>): User | undefined => {
    const users = getCollection<User>(STORAGE_KEYS.users);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    setCollection(STORAGE_KEYS.users, users);
    return users[index];
  },
  delete: (id: string): boolean => {
    const users = getCollection<User>(STORAGE_KEYS.users);
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    setCollection(STORAGE_KEYS.users, filtered);
    return true;
  },
};

// ============================================================
// Products
// ============================================================
export const ProductStore = {
  getAll: (): Product[] => getCollection<Product>(STORAGE_KEYS.products),
  getById: (id: string): Product | undefined =>
    getCollection<Product>(STORAGE_KEYS.products).find((p) => p.id === id),
  getBySlug: (slug: string): Product | undefined =>
    getCollection<Product>(STORAGE_KEYS.products).find((p) => p.slug === slug),
  getByCategory: (category: string): Product[] =>
    getCollection<Product>(STORAGE_KEYS.products).filter((p) => p.category === category),
  getFeatured: (): Product[] =>
    getCollection<Product>(STORAGE_KEYS.products).filter((p) => p.featured && p.status === "active"),
  search: (query: string): Product[] => {
    const q = query.toLowerCase();
    return getCollection<Product>(STORAGE_KEYS.products).filter(
      (p) =>
        p.status === "active" &&
        (p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q))
    );
  },
  create: (product: Product): Product => {
    const products = getCollection<Product>(STORAGE_KEYS.products);
    products.push(product);
    setCollection(STORAGE_KEYS.products, products);
    return product;
  },
  update: (id: string, updates: Partial<Product>): Product | undefined => {
    const products = getCollection<Product>(STORAGE_KEYS.products);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    products[index] = { ...products[index], ...updates };
    setCollection(STORAGE_KEYS.products, products);
    return products[index];
  },
  delete: (id: string): boolean => {
    const products = getCollection<Product>(STORAGE_KEYS.products);
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    setCollection(STORAGE_KEYS.products, filtered);
    return true;
  },
};

// ============================================================
// Categories
// ============================================================
export const CategoryStore = {
  getAll: (): Category[] => getCollection<Category>(STORAGE_KEYS.categories),
  getById: (id: string): Category | undefined =>
    getCollection<Category>(STORAGE_KEYS.categories).find((c) => c.id === id),
  getBySlug: (slug: string): Category | undefined =>
    getCollection<Category>(STORAGE_KEYS.categories).find((c) => c.slug === slug),
  create: (category: Category): Category => {
    const categories = getCollection<Category>(STORAGE_KEYS.categories);
    categories.push(category);
    setCollection(STORAGE_KEYS.categories, categories);
    return category;
  },
  update: (id: string, updates: Partial<Category>): Category | undefined => {
    const categories = getCollection<Category>(STORAGE_KEYS.categories);
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    categories[index] = { ...categories[index], ...updates };
    setCollection(STORAGE_KEYS.categories, categories);
    return categories[index];
  },
};

// ============================================================
// Orders
// ============================================================
export const OrderStore = {
  getAll: (): Order[] => getCollection<Order>(STORAGE_KEYS.orders),
  getById: (id: string): Order | undefined =>
    getCollection<Order>(STORAGE_KEYS.orders).find((o) => o.id === id),
  getByUserId: (userId: string): Order[] =>
    getCollection<Order>(STORAGE_KEYS.orders).filter((o) => o.userId === userId),
  create: (order: Order): Order => {
    const orders = getCollection<Order>(STORAGE_KEYS.orders);
    orders.push(order);
    setCollection(STORAGE_KEYS.orders, orders);
    return order;
  },
  update: (id: string, updates: Partial<Order>): Order | undefined => {
    const orders = getCollection<Order>(STORAGE_KEYS.orders);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;
    orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
    setCollection(STORAGE_KEYS.orders, orders);
    return orders[index];
  },
};

// ============================================================
// Cart
// ============================================================
export const CartStore = {
  get: (userId: string): Cart => {
    const carts = getCollection<Cart>(STORAGE_KEYS.carts);
    const cart = carts.find((c) => c.userId === userId);
    return cart || { userId, items: [], updatedAt: new Date().toISOString() };
  },
  save: (cart: Cart): Cart => {
    const carts = getCollection<Cart>(STORAGE_KEYS.carts);
    const index = carts.findIndex((c) => c.userId === cart.userId);
    cart.updatedAt = new Date().toISOString();
    if (index === -1) {
      carts.push(cart);
    } else {
      carts[index] = cart;
    }
    setCollection(STORAGE_KEYS.carts, carts);
    return cart;
  },
  clear: (userId: string): void => {
    const carts = getCollection<Cart>(STORAGE_KEYS.carts);
    const filtered = carts.filter((c) => c.userId !== userId);
    setCollection(STORAGE_KEYS.carts, filtered);
  },
};

// ============================================================
// Reviews
// ============================================================
export const ReviewStore = {
  getAll: (): Review[] => getCollection<Review>(STORAGE_KEYS.reviews),
  getByProductId: (productId: string): Review[] =>
    getCollection<Review>(STORAGE_KEYS.reviews).filter((r) => r.productId === productId),
  create: (review: Review): Review => {
    const reviews = getCollection<Review>(STORAGE_KEYS.reviews);
    reviews.push(review);
    setCollection(STORAGE_KEYS.reviews, reviews);
    return review;
  },
};


// ============================================================
// ID generators
// ============================================================
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}${random}`;
}

// ============================================================
// Dashboard Stats
// ============================================================
export function getDashboardStats() {
  const orders = OrderStore.getAll();
  const products = ProductStore.getAll();
  const users = UserStore.getAll();

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.status === "active").length;
  const totalCustomers = users.filter((u) => u.role === "customer").length;

  const ordersByStatus = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const topProducts = products
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5)
    .map((p) => ({ name: p.name, sales: p.reviewCount, revenue: p.price * p.reviewCount }));

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    totalCustomers,
    ordersByStatus,
    topProducts,
  };
}
