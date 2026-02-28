import { z } from 'zod';

// ---- Product Schemas ----
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  brand: z.string().min(1).max(100),
  category: z.enum(['CIGARETTES', 'LIGHTERS', 'ROLLING_PAPERS', 'BEVERAGES', 'SNACKS', 'ESSENTIALS']),
  description: z.string().min(1).max(2000),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().min(0),
  image: z.string().optional(),
  packSize: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

// ---- Address Schemas ----
export const createAddressSchema = z.object({
  label: z.string().min(1).max(50).default('Home'),
  fullAddress: z.string().min(5, 'Address is too short'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

// ---- Order Schemas ----
export const createOrderSchema = z.object({
  addressId: z.string().uuid(),
  deliveryNotes: z.string().max(500).optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1, 'Order must have at least one item'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
});

// ---- Cart Schema ----
export const syncCartSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
});

// ---- Query Schemas ----
export const productQuerySchema = z.object({
  category: z.enum(['CIGARETTES', 'LIGHTERS', 'ROLLING_PAPERS', 'BEVERAGES', 'SNACKS', 'ESSENTIALS']).optional(),
  brand: z.string().optional(),
  minPrice: z.string().optional().transform((v) => v ? parseFloat(v) : undefined),
  maxPrice: z.string().optional().transform((v) => v ? parseFloat(v) : undefined),
  search: z.string().optional(),
  page: z.string().optional().transform((v) => v ? parseInt(v) : 1),
  limit: z.string().optional().transform((v) => v ? parseInt(v) : 12),
  sortBy: z.enum(['price', 'name', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
}).passthrough();

export const orderQuerySchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']).optional(),
  page: z.string().optional().transform((v) => v ? parseInt(v) : 1),
  limit: z.string().optional().transform((v) => v ? parseInt(v) : 20),
}).passthrough();

// ---- Profile Schema ----
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).optional(),
});
