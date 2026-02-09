# 🔐 Express BetterAuth PostgreSQL Authentication System

**Production-ready authentication boilerplate** - Copy, customize roles, and deploy in 10 minutes!

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your database URL and secrets

# 4. Customize roles in prisma/schema/enums.prisma
# Example: SUPER_ADMIN, ADMIN, VENDOR, CUSTOMER

# 5. Setup database
npm run generate
npm run migrate

# 6. Start development
npm run dev
```

**Server running at:** http://localhost:5000

## 🎯 What You Get

### Complete Authentication System
- ✅ User Registration & Login
- ✅ JWT Access & Refresh Tokens
- ✅ Logout with Session Cleanup
- ✅ Role-Based Access Control (RBAC)
- ✅ Session Management (BetterAuth)

### Production-Ready Security
- ✅ Helmet Security Headers (XSS, Clickjacking protection)
- ✅ CORS Configuration
- ✅ Rate Limiting (API, Auth, Password Reset)
- ✅ Strong Password Validation
- ✅ HTTP-Only Secure Cookies

### Developer Experience
- ✅ TypeScript with Full Type Safety
- ✅ Prisma ORM (PostgreSQL)
- ✅ Zod Validation
- ✅ Global Error Handling
- ✅ Request Logging (Dev mode)
- ✅ Health Check Endpoint
- ✅ Graceful Shutdown

## 📡 API Endpoints

### Authentication
```http
POST   /api/v1/auth/register        # Register new user
POST   /api/v1/auth/login           # Login user
POST   /api/v1/auth/logout          # Logout user
POST   /api/v1/auth/refresh-token   # Refresh access token
```

### User Management
```http
GET    /api/v1/users/:userId        # Get user profile (Protected)
```

### Health Check
```http
GET    /api/v1/health               # System health status
```

## 🎭 Customize Roles (IMPORTANT!)

**Before first migration**, edit `prisma/schema/enums.prisma`:

### E-commerce Example
```prisma
enum Role {
    SUPER_ADMIN
    ADMIN
    VENDOR
    CUSTOMER
}
```

### Healthcare Example
```prisma
enum Role {
    SUPER_ADMIN
    ADMIN
    DOCTOR
    PATIENT
    NURSE
}
```

### Education Example
```prisma
enum Role {
    SUPER_ADMIN
    ADMIN
    TEACHER
    STUDENT
}
```

**Then update default role in:**
1. `prisma/schema/auth.prisma` → `role Role @default(YOUR_ROLE)`
2. `src/app/lib/auth.ts` → `defaultValue: Role.YOUR_ROLE`

## 🔧 Environment Variables

Required in `.env`:

```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# BetterAuth (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-32-chars-min
BETTER_AUTH_URL=http://localhost:5000

# JWT Tokens (generate with: openssl rand -base64 32)
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# Session
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=1d
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=1d

# CORS (Optional - for production)
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🧪 Test the API

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### Check Health
```bash
curl http://localhost:5000/api/v1/health
```

## 🛡️ Protect Your Routes

```typescript
import { checkAuth } from "./middleware/checkAuth";
import { Role } from "../generated/prisma/enums";

// Any authenticated user
router.get("/profile", checkAuth(), controller.getProfile);

// Admin only
router.get("/admin", checkAuth(Role.ADMIN), controller.adminPanel);

// Multiple roles
router.post("/manage", 
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
  controller.manage
);
```

## 📦 Add New Features

### 1. Create Module
```
src/app/module/yourModule/
├── yourModule.service.ts      # Business logic
├── yourModule.controller.ts   # Request handlers
├── yourModule.route.ts        # Routes
└── yourModule.validation.ts   # Zod schemas (optional)
```

### 2. Register Routes
```typescript
// src/app/routes/index.ts
import { YourModuleRoutes } from "../module/yourModule/yourModule.route";

router.use("/your-module", YourModuleRoutes);
```

## 🚀 Production Deployment

### Pre-Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong secrets (32+ characters)
- [ ] Configure `ALLOWED_ORIGINS`
- [ ] Update `BETTER_AUTH_URL` to production URL
- [ ] Enable HTTPS
- [ ] Run migrations on production database

### Deploy
```bash
# Build
npm run build

# Start
npm start
```

### Security Features Active
- ✅ Helmet security headers
- ✅ CORS with allowed origins
- ✅ Rate limiting (100 req/15min API, 5 req/15min auth)
- ✅ HTTP-only secure cookies
- ✅ Strong password requirements
- ✅ Session validation
- ✅ Graceful shutdown

## 📁 Project Structure

```
src/
├── app/
│   ├── config/          # Environment configuration
│   ├── errorHelpers/    # Error handling utilities
│   ├── lib/            # Core libraries (Prisma, BetterAuth)
│   ├── middleware/     # Express middlewares
│   │   ├── checkAuth.ts       # Authentication
│   │   ├── cors.ts            # CORS config
│   │   ├── helmet.ts          # Security headers
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   └── requestLogger.ts   # Request logging
│   ├── module/         # Feature modules
│   │   ├── auth/       # Authentication
│   │   ├── user/       # User management
│   │   └── health/     # Health check
│   ├── routes/         # Route definitions
│   ├── shared/         # Shared utilities
│   └── utils/          # Helper functions
├── app.ts              # Express app setup
└── server.ts           # Server entry point

prisma/schema/
├── schema.prisma       # Main schema
├── auth.prisma         # Auth models
└── enums.prisma        # Roles & enums (CUSTOMIZE THIS!)
```

## 🔐 Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## 🎯 Use Cases

Perfect for:
- E-commerce platforms
- Healthcare systems
- Education platforms
- SaaS applications
- Real estate apps
- Food delivery apps
- Job portals
- Any project needing authentication!

## 📝 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run migrate    # Run database migrations
npm run generate   # Generate Prisma Client
npm run studio     # Open Prisma Studio
npm run lint       # Run ESLint
```

## 🔄 Authentication Flow

1. User registers/logs in
2. System generates:
   - BetterAuth session token
   - JWT access token (1 day)
   - JWT refresh token (7 days)
3. All tokens stored in HTTP-only cookies
4. Protected routes verify session + access token
5. Refresh token endpoint generates new access token
6. Logout clears all tokens and session

## 🐛 Troubleshooting

### Prisma Client not found
```bash
npm run generate
```

### Migration failed
```bash
npm run migrate
```

### TypeScript errors
```bash
npm run generate
# Restart TypeScript server in your IDE
```

### Port already in use
Change `PORT` in `.env` file

## 🎓 Best Practices

1. **Always customize roles before first migration**
2. **Keep secrets secure** - Never commit `.env`
3. **Use transactions** for complex operations
4. **Validate input** with Zod schemas
5. **Handle errors** properly
6. **Use TypeScript types** for better code quality
7. **Follow modular structure** for scalability

## 🔮 Future Enhancements

Consider adding:
- Email verification
- Password reset
- OAuth providers (Google, GitHub)
- Two-factor authentication (2FA)
- API documentation (Swagger)
- Unit & integration tests
- Advanced logging (Winston/Pino)
- Redis for session storage

## 📄 License

ISC

## 🎉 You're Ready!

**Time to first working auth: ~10 minutes**

1. Copy this folder to your project
2. Customize roles in `enums.prisma`
3. Run setup commands
4. Start building your features!

**Happy Coding! 🚀**
