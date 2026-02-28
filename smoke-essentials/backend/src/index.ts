import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import addressRoutes from './routes/address.routes';
import cartRoutes from './routes/cart.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// ---- Middleware ----
app.use(helmet());

// CORS: Allow both local dev and production origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://tuffpuff-store.vercel.app',
];
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
};

// Apply CORS to all routes including preflight OPTIONS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

app.use(apiLimiter);

// ---- Health Check ----
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// ---- 404 ----
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ---- Error Handler ----
app.use(errorHandler);

// ---- Start Server ----
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
