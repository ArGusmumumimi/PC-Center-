// ============================================================
// PC Center — Data Schema
// ============================================================

export type UserRole = "customer" | "staff" | "manager";

export interface User {
  id: string;
  email: string;
  password: string; // simple hash for demo
  name: string;
  phone: string;
  address: string;
  role: UserRole;
  status?: "active" | "inactive";
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface ProductSpecs {
  [key: string]: string;
}

export type ProductStatus = "active" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number;
  category: string; // category slug
  brand: string;
  images: string[];
  specs: ProductSpecs;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  status: ProductStatus;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "credit_card" | "bank_transfer" | "cod";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber: string;
  promoCode: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId?: string; // targets one specific user (e.g. the customer who owns the order)
  role?: UserRole; // targets everyone with this role (e.g. broadcast to staff/manager)
  orderId?: string;
  message: string;
  read: boolean;
  createdAt: string;
}



// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
