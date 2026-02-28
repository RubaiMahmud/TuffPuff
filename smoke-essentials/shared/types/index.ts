// ============================================
// Smoke & Essentials — Shared Types
// ============================================

// ---- Enums ----
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum ProductCategory {
  CIGARETTES = 'CIGARETTES',
  LIGHTERS = 'LIGHTERS',
  ROLLING_PAPERS = 'ROLLING_PAPERS',
  BEVERAGES = 'BEVERAGES',
  SNACKS = 'SNACKS',
  ESSENTIALS = 'ESSENTIALS',
}

// ---- User ----
export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  ageVerified: boolean;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Address ----
export interface IAddress {
  id: string;
  userId: string;
  label: string;
  fullAddress: string;
  lat: number;
  lng: number;
  isDefault: boolean;
  createdAt: string;
}

// ---- Product ----
export interface IProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number;
  stock: number;
  image: string;
  packSize: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Cart ----
export interface ICartItem {
  productId: string;
  product: IProduct;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

// ---- Order ----
export interface IOrderItem {
  id: string;
  productId: string;
  product: IProduct;
  quantity: number;
  price: number;
}

export interface IOrder {
  id: string;
  userId: string;
  user?: IUser;
  items: IOrderItem[];
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  finalAmount: number;
  address: IAddress;
  addressId: string;
  deliveryNotes?: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- API Response ----
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ---- Auth ----
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  ageVerified: boolean;
  termsAccepted: boolean;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

// ---- Filters ----
export interface IProductFilters {
  category?: ProductCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface IOrderFilters {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}
