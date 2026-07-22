// ============================================================
// PC Center — Server-side In-Memory Store (for API Routes)

// ============================================================
import type { User, Product, Category, Order, Cart, Review } from "./schema";
import { seedUsers, seedProducts, seedCategories, seedOrders, seedReviews, simpleHash } from "./seed";
import { SignJWT, jwtVerify } from "jose";

// In-memory store (persists until server restart)
const globalStore = globalThis as unknown as {
  __users: User[];
  __products: Product[];
  __categories: Category[];
  __orders: Order[];
  __carts: Cart[];
  __reviews: Review[];
};

let users: User[] = globalStore.__users || [...seedUsers];
let products: Product[] = globalStore.__products || [...seedProducts];
let categories: Category[] = globalStore.__categories || [...seedCategories];
let orders: Order[] = globalStore.__orders || [...seedOrders];
let carts: Cart[] = globalStore.__carts || [];
let reviews: Review[] = globalStore.__reviews || [...seedReviews];

if (process.env.NODE_ENV !== "production") {
  globalStore.__users = users;
  globalStore.__products = products;
  globalStore.__categories = categories;
  globalStore.__orders = orders;
  globalStore.__carts = carts;
  globalStore.__reviews = reviews;
}


// JWT Secret (Mock)
const JWT_SECRET = new TextEncoder().encode("PC_CENTER_SUPER_SECRET_KEY_MOCK");

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}${random}`;
}

// ============================================================
// Auth
// ============================================================
export const ServerAuth = {
  async login(email: string, password: string) {
    const user = users.find((u) => u.email === email);
    if (!user) return { error: "ไม่พบบัญชีผู้ใช้นี้" };
    if (user.password !== simpleHash(password)) return { error: "รหัสผ่านไม่ถูกต้อง" };
    if (user.status === "inactive") return { error: "บัญชีนี้ถูกระงับการใช้งาน" };
    
    const token = await new SignJWT({ userId: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);
      
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },
  async register(name: string, email: string, password: string, phone = "", address = "") {
    if (users.find((u) => u.email === email)) return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
    const user: User = {
      id: generateId("usr"),
      email, password: simpleHash(password), name, phone, address,
      role: "customer", avatar: "/avatars/customer.png",
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    users.push(user);
    
    const token = await new SignJWT({ userId: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);
      
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },
  async getSession(token: string) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as { userId: string; role: string };
    } catch {
      return null;
    }
  },
  async getUserByToken(token: string) {
    const session = await this.getSession(token);
    if (!session) return null;
    const user = users.find((u) => u.id === session.userId);
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser;
  },
};

// ============================================================
// ============================================================
// Products
// ============================================================
function getReviewStats(productId: string): { rating: number; reviewCount: number } {
  const productReviews = reviews.filter((r) => r.productId === productId);
  const reviewCount = productReviews.length;
  if (reviewCount === 0) return { rating: 0, reviewCount: 0 };
  const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
  return { rating: Math.round(avg * 10) / 10, reviewCount };
}

const formatProduct = (p: Product): Product => ({
  ...p,
  ...getReviewStats(p.id),
  status: p.stock === 0 ? "out_of_stock" : p.stock < 5 ? "low_stock" : "active"
});

export const ServerProducts = {
  getAll(params?: { search?: string; category?: string; brand?: string; page?: number; pageSize?: number; sort?: string }) {
    let result = products;
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (params?.category) result = result.filter((p) => p.category === params.category);
    if (params?.brand) result = result.filter((p) => p.brand === params.brand);
    if (params?.sort) {
      switch (params.sort) {
        case "price_asc": result.sort((a, b) => a.price - b.price); break;
        case "price_desc": result.sort((a, b) => b.price - a.price); break;
        case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
        case "rating": result.sort((a, b) => getReviewStats(b.id).rating - getReviewStats(a.id).rating); break;
        case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      }
    }
    const total = result.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 12;
    const start = (page - 1) * pageSize;
    return { items: result.slice(start, start + pageSize).map(formatProduct), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },
  getById(id: string) { const p = products.find((p) => p.id === id); return p ? formatProduct(p) : undefined; },
  getBySlug(slug: string) { const p = products.find((p) => p.slug === slug); return p ? formatProduct(p) : undefined; },
  getAllAdmin() { return products.map(formatProduct); },
  create(data: Omit<Product, "id" | "createdAt">) {
    const product: Product = formatProduct({ ...data, id: generateId("prod"), createdAt: new Date().toISOString() } as Product);
    products.push(product);
    return product;
  },
  update(id: string, data: Partial<Product>) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = formatProduct({ ...products[index], ...data });
    return products[index];
  },
  delete(id: string) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};

// ============================================================
// Categories
// ============================================================
export const ServerCategories = {
  getAll() { return categories; },
  create(data: Omit<Category, "id">) {
    const category: Category = { ...data, id: generateId("cat") };
    categories.push(category);
    return category;
  },
};

// ============================================================
// Orders
// ============================================================
export const ServerOrders = {
  getAll() { return orders; },
  getByUser(userId: string) { return orders.filter((o) => o.userId === userId); },
  getById(id: string) { return orders.find((o) => o.id === id); },
  create(data: Omit<Order, "id" | "createdAt" | "updatedAt">) {
    const order: Order = { ...data, id: generateId("ord"), status: "pending", paymentStatus: "pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    orders.push(order);
    
    // Deduct stock
    for (const item of order.items) {
      const product = ServerProducts.getById(item.productId);
      if (product) {
        ServerProducts.update(product.id, { stock: Math.max(0, product.stock - item.quantity) });
      }
    }
    
    // Clear cart
    ServerCart.clear(order.userId);
    
    return order;
  },
  updateStatus(id: string, status: string, trackingNumber?: string) {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    
    const oldStatus = orders[index].status;
    orders[index] = { ...orders[index], status: status as Order["status"], updatedAt: new Date().toISOString() };
    
    if (trackingNumber) orders[index].trackingNumber = trackingNumber;
    if (status === "delivered") orders[index].paymentStatus = "paid";
    
    // Restore stock if cancelled
    if (status === "cancelled" && oldStatus !== "cancelled") {
      for (const item of orders[index].items) {
        const product = ServerProducts.getById(item.productId);
        if (product) {
          ServerProducts.update(product.id, { stock: product.stock + item.quantity });
        }
      }
    }
    
    return orders[index];
  },
};

// ============================================================
// Cart (server-side)
// ============================================================
export const ServerCart = {
  get(userId: string) {
    return carts.find((c) => c.userId === userId) || { userId, items: [], updatedAt: new Date().toISOString() };
  },
  save(cart: Cart) {
    const index = carts.findIndex((c) => c.userId === cart.userId);
    if (index === -1) carts.push(cart);
    else carts[index] = cart;
    return cart;
  },
  clear(userId: string) {
    carts = carts.filter((c) => c.userId !== userId);
  },
};

// ============================================================
// Users
// ============================================================
export const ServerUsers = {
  getAll() {
    return users.map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safe } = u;
      return safe;
    });
  },
  updateRole(id: string, role: string) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], role: role as User["role"], updatedAt: new Date().toISOString() };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safe } = users[index];
    return safe;
  },
  updateStatus(id: string, status: "active" | "inactive") {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], status, updatedAt: new Date().toISOString() };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safe } = users[index];
    return safe;
  },
  create(data: { name: string; email: string; password: string; phone?: string; address?: string; role: "customer" | "staff" | "manager" }) {
    if (users.find((u) => u.email === data.email)) return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
    const user: User = {
      id: generateId("usr"),
      name: data.name,
      email: data.email,
      password: simpleHash(data.password),
      role: data.role,
      status: "active",
      avatar: "",
      phone: data.phone || "",
      address: data.address || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return { data: safeUser };
  }
};

// ============================================================
// Reviews
// ============================================================
export const ServerReviews = {
  getByProduct(productId: string) { return reviews.filter((r) => r.productId === productId); },
  create(data: Omit<Review, "id" | "createdAt">) {
    const review: Review = { ...data, id: generateId("rev"), createdAt: new Date().toISOString() };
    reviews.push(review);
    // Product rating/reviewCount are derived on read (see getReviewStats in formatProduct),
    // so no manual aggregate update is needed here.
    return review;
  },
};



// ============================================================
// Dashboard Stats
// ============================================================
export const ServerDashboard = {
  getStats() {
    const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const allFormattedProducts = ServerProducts.getAllAdmin();
    const totalProducts = allFormattedProducts.length;
    const lowStockProducts = allFormattedProducts.filter((p) => p.status === "low_stock").length;
    const totalCustomers = users.filter((u) => u.role === "customer").length;

    const ordersByStatus = {
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    const topProducts = [...allFormattedProducts]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5)
      .map((p) => ({ id: p.id, name: p.name, sales: p.reviewCount, revenue: p.price * p.reviewCount, stock: p.stock }));

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return { totalRevenue, totalOrders, pendingOrders, totalProducts, lowStockProducts, totalCustomers, ordersByStatus, topProducts, recentOrders };
  },
};
