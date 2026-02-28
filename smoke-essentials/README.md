# 🚬 Smoke & Essentials Delivery Platform

A production-ready, scalable, secure e-commerce delivery platform for cigarettes and personal essentials with location-aware delivery, age verification, and a full admin panel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, Zustand, React Hook Form, Axios |
| Backend | Node.js, Express, TypeScript, JWT, bcrypt, Zod |
| Database | PostgreSQL with Prisma ORM |
| Maps | Google Maps JavaScript API + Geocoding |
| Deployment | Docker, Docker Compose, Nginx |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18
- **PostgreSQL** running locally (or use Docker)
- **npm** >= 9

### 1. Clone & Install

```bash
cd smoke-essentials

# Install all dependencies
npm run setup
```

### 2. Environment Configuration

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your DATABASE_URL, JWT_SECRET, etc.

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your API URL and Google Maps key
```

### 3. Database Setup

```bash
# Run migrations
cd backend
npx prisma migrate dev --name init

# Seed sample data (15 products + admin + test user)
npx prisma db seed

# Optional: View database in browser
npx prisma studio
```

### 4. Run Development Servers

```bash
# From root directory — runs both frontend & backend
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **API Health**: http://localhost:4000/api/health

### 5. Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smokeessentials.com | admin123 |
| User | john@example.com | user1234 |

---

## 🐳 Docker Deployment

```bash
# Start everything (PostgreSQL + Backend + Frontend)
docker-compose up --build

# Run migrations inside container
docker exec smoke-essentials-api npx prisma migrate deploy
docker exec smoke-essentials-api npx prisma db seed
```

---

## 📁 Project Structure

```
smoke-essentials/
├── backend/                    # Express API Server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Sample data
│   └── src/
│       ├── controllers/        # Route handlers
│       ├── middleware/          # Auth, validation, error, rate limit
│       ├── routes/             # API route definitions
│       ├── schemas/            # Zod validation schemas
│       ├── lib/                # Prisma client, JWT utils
│       └── index.ts            # Server entry point
├── frontend/                   # Next.js App
│   └── src/
│       ├── app/                # App Router pages
│       │   ├── admin/          # Admin panel (dashboard, products, orders, users)
│       │   ├── products/       # Product listing & detail
│       │   ├── cart/           # Shopping cart
│       │   ├── checkout/       # Checkout with map
│       │   ├── orders/         # Order history
│       │   ├── login/          # Auth pages
│       │   ├── signup/
│       │   └── forgot-password/
│       ├── components/         # Reusable components
│       ├── store/              # Zustand stores (auth, cart, ui)
│       └── lib/                # Axios API client
├── shared/                     # Shared TypeScript types
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx.conf
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/refresh` | 🍪 | Refresh token |
| POST | `/api/auth/logout` | ❌ | Logout |
| POST | `/api/auth/forgot-password` | ❌ | Request reset |
| GET | `/api/auth/profile` | ✅ | Get profile |
| PATCH | `/api/auth/profile` | ✅ | Update profile |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | List (with filters) |
| GET | `/api/products/brands` | ❌ | Get all brands |
| GET | `/api/products/categories` | ❌ | Get categories |
| GET | `/api/products/:id` | ❌ | Product detail |
| GET | `/api/products/:id/similar` | ❌ | Similar products |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | ✅ | Create order |
| GET | `/api/orders` | ✅ | User's orders |
| GET | `/api/orders/:id` | ✅ | Order detail |

### Addresses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/addresses` | ✅ | List addresses |
| POST | `/api/addresses` | ✅ | Create address |
| PATCH | `/api/addresses/:id` | ✅ | Update address |
| DELETE | `/api/addresses/:id` | ✅ | Delete address |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/cart/sync` | 🔓 | Validate & sync cart |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | 🛡️ | Dashboard stats |
| GET/POST | `/api/admin/products` | 🛡️ | Manage products |
| PATCH/DELETE | `/api/admin/products/:id` | 🛡️ | Update/delete product |
| GET | `/api/admin/orders` | 🛡️ | All orders |
| PATCH | `/api/admin/orders/:id/status` | 🛡️ | Update order status |
| GET | `/api/admin/users` | 🛡️ | List users |
| GET | `/api/admin/users/:userId/orders` | 🛡️ | User order history |

**Legend**: ❌ No auth · ✅ User auth · 🔓 Optional auth · 🍪 Cookie-based · 🛡️ Admin only

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWT access tokens (15min) + refresh tokens (7 days) in HTTP-only cookies
- **Zod** validation on all inputs
- **Rate limiting** on auth routes (20 req/15min)
- **Helmet** security headers
- Admin routes protected by role check
- 18+ age verification required

---

## 🚀 Production Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Import in Vercel
3. Set root directory to `frontend`
4. Add environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_KEY`)
5. Deploy

### Railway / Render (Backend)
1. Push to GitHub
2. Create new service pointing to `backend` directory
3. Set environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.)
4. Add PostgreSQL addon
5. Run `npx prisma migrate deploy && npx prisma db seed` as build command

---

## 📊 Future-Ready Architecture

The codebase is structured for easy Phase 2 additions:

- **Live Delivery Tracking**: Add WebSocket events to order status updates
- **Rider App**: Create new mobile-first frontend consuming same API
- **Subscription System**: Add `Subscription` model + recurring order logic
- **Promo Codes**: Add `PromoCode` model, discount calculation in order creation
- **Reviews & Ratings**: Add `Review` model linked to Product + OrderItem
- **Wallet System**: Add `Wallet` + `Transaction` models
- **Payment Integration**: Stripe/PayPal hooks in `/api/payments` route

---

## ⚠️ Legal Notice

This platform sells age-restricted products. Ensure compliance with local regulations:
- 18+ age verification is enforced at signup and site entry
- Tobacco health warning banners are displayed
- Terms & Conditions acceptance is required
- Admin age compliance tracking available
