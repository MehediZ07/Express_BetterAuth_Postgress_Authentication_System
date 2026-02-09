# 🛠️ Setup Guide

<div align="center">

## Complete Setup Instructions

**From Zero to Running Auth in 10 Minutes**

---

</div>

## 📋 Prerequisites

```
✅ Node.js 18+ installed
✅ PostgreSQL database running
✅ npm or pnpm package manager
✅ Code editor (VS Code recommended)
```

---

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

**⏱️ Time:** ~2 minutes

**What it does:**
- Installs all required packages
- Sets up TypeScript
- Configures Prisma
- Installs security packages

---

### Step 2: Environment Configuration

#### 2.1 Copy Environment File

```bash
cp .env.example .env
```

#### 2.2 Edit `.env` File

**Required Variables:**

```env
# 🌍 Environment
NODE_ENV=development
PORT=5000

# 🗄️ Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# 🔐 BetterAuth (generate: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-32-chars-min
BETTER_AUTH_URL=http://localhost:5000

# 🎫 JWT Tokens (generate: openssl rand -base64 32)
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# ⏰ Session
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=1d
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=1d

# 🌐 CORS (Production only)
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### 2.3 Generate Secrets

```bash
# Generate BETTER_AUTH_SECRET
openssl rand -base64 32

# Generate ACCESS_TOKEN_SECRET
openssl rand -base64 32

# Generate REFRESH_TOKEN_SECRET
openssl rand -base64 32
```

---

### Step 3: Customize User Roles

> ⚠️ **IMPORTANT:** Do this BEFORE first migration!

#### 3.1 Edit Role Enum

**File:** `prisma/schema/enums.prisma`

Choose from these examples or create your own:

<table>
<tr>
<td width="50%">

**🛒 E-commerce**
```prisma
enum Role {
    SUPER_ADMIN
    ADMIN
    VENDOR
    CUSTOMER
}
```

</td>
<td width="50%">

**🏥 Healthcare**
```prisma
enum Role {
    SUPER_ADMIN
    ADMIN
    DOCTOR
    PATIENT
}
```

</td>
</tr>
<tr>
<td width="50%">

**🎓 Education**
```prisma
enum Role {
    SUPER_ADMIN
    ADMIN
    TEACHER
    STUDENT
}
```

</td>
<td width="50%">

**💼 SaaS**
```prisma
enum Role {
    SUPER_ADMIN
    ADMIN
    OWNER
    MEMBER
}
```

</td>
</tr>
</table>

#### 3.2 Update Default Role

**File 1:** `prisma/schema/auth.prisma`

```prisma
model User {
    // ... other fields
    role Role @default(CUSTOMER)  // 👈 Change to your default
    // ... other fields
}
```

**File 2:** `src/app/lib/auth.ts`

```typescript
role: {
    type: "string",
    required: true,
    defaultValue: Role.CUSTOMER  // 👈 Change to your default
},
```

**📚 More examples:** [ROLE_CUSTOMIZATION.md](ROLE_CUSTOMIZATION.md)

---

### Step 4: Setup Database

```bash
# Generate Prisma Client
npm run generate

# Run migrations
npm run migrate
```

**⏱️ Time:** ~2 minutes

**What it does:**
- Generates TypeScript types
- Creates database tables
- Sets up relationships
- Applies schema changes

---

### Step 5: Start Development Server

```bash
npm run dev
```

**✅ Success!** Server running at: http://localhost:5000

---

## 🧪 Test Your Setup

### Test 1: Health Check

```bash
curl http://localhost:5000/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "System is healthy",
  "data": {
    "status": "UP",
    "database": "Connected"
  }
}
```

### Test 2: Register User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Test 3: Login User

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

---

## 📦 Project Structure

```
src/
├── app/
│   ├── config/          # 🔧 Environment configuration
│   ├── errorHelpers/    # ❌ Error handling utilities
│   ├── lib/             # 📚 Core libraries (Prisma, BetterAuth)
│   ├── middleware/      # 🛡️ Express middlewares
│   │   ├── checkAuth.ts       # Authentication
│   │   ├── cors.ts            # CORS config
│   │   ├── helmet.ts          # Security headers
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   └── requestLogger.ts   # Request logging
│   ├── module/          # 📦 Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── user/        # User management
│   │   └── health/      # Health check
│   ├── routes/          # 🛣️ Route definitions
│   ├── shared/          # 🔄 Shared utilities
│   └── utils/           # 🛠️ Helper functions
├── app.ts               # 🚀 Express app setup
└── server.ts            # 🖥️ Server entry point

prisma/schema/
├── schema.prisma        # 📋 Main schema
├── auth.prisma          # 🔐 Auth models
└── enums.prisma         # 🎭 Roles (CUSTOMIZE THIS!)
```

---

## 🎨 Customization Examples

### Add Custom User Fields

**File:** `prisma/schema/auth.prisma`

```prisma
model User {
    // ... existing fields
    phoneNumber String?
    address     String?
    avatar      String?
    dateOfBirth DateTime?
    // ... add your custom fields
}
```

**Then run:**
```bash
npm run migrate
```

### Create New Module

**1. Create folder:** `src/app/module/product/`

**2. Create files:**

```typescript
// product.service.ts
export const ProductService = {
    getAllProducts: async () => {
        return await prisma.product.findMany();
    }
};

// product.controller.ts
export const ProductController = {
    getAllProducts: catchAsync(async (req, res) => {
        const result = await ProductService.getAllProducts();
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Products retrieved",
            data: result
        });
    })
};

// product.route.ts
const router = Router();
router.get("/", ProductController.getAllProducts);
export const ProductRoutes = router;
```

**3. Register routes:** `src/app/routes/index.ts`

```typescript
import { ProductRoutes } from "../module/product/product.route";
router.use("/products", ProductRoutes);
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

```
□ Set NODE_ENV=production
□ Generate strong secrets (32+ characters)
□ Configure ALLOWED_ORIGINS with your domain
□ Update BETTER_AUTH_URL to production URL
□ Setup PostgreSQL production database
□ Enable HTTPS
□ Configure environment variables on server
□ Test all endpoints
□ Setup monitoring
□ Configure backups
```

### Build & Deploy

```bash
# Build TypeScript
npm run build

# Run migrations on production DB
npm run migrate

# Start production server
npm start
```

---

## 🐛 Troubleshooting

<table>
<tr>
<th>Issue</th>
<th>Solution</th>
</tr>
<tr>
<td>🔴 Prisma Client not found</td>
<td><code>npm run generate</code></td>
</tr>
<tr>
<td>🔴 Migration failed</td>
<td>Check DATABASE_URL, verify PostgreSQL is running, then <code>npm run migrate</code></td>
</tr>
<tr>
<td>🔴 TypeScript errors</td>
<td><code>npm run generate</code> + Restart TypeScript server in IDE</td>
</tr>
<tr>
<td>🔴 Port already in use</td>
<td>Change <code>PORT</code> in <code>.env</code> file</td>
</tr>
<tr>
<td>🔴 Cannot connect to database</td>
<td>Verify PostgreSQL is running, check DATABASE_URL format, ensure database exists</td>
</tr>
</table>

---

## 🎓 Best Practices

```
✅ Always customize roles before first migration
✅ Use strong secrets (minimum 32 characters)
✅ Validate all inputs with Zod schemas
✅ Handle errors properly with try-catch
✅ Use transactions for multi-table operations
✅ Leverage TypeScript for better code quality
✅ Follow modular structure for scalability
✅ Keep .env in .gitignore
✅ Document your custom endpoints
✅ Test thoroughly before deployment
```

---

## 📚 Next Steps

<div align="center">

### 🎉 **Setup Complete!**

Now you can:

**1.** Add your custom modules  
**2.** Implement your business logic  
**3.** Build your features  
**4.** Deploy to production  

---

### 📖 Helpful Resources

**API Reference** → [README.md](README.md)  
**Role Examples** → [ROLE_CUSTOMIZATION.md](ROLE_CUSTOMIZATION.md)  
**Architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)

---

**Happy Coding! 🚀**

</div>
