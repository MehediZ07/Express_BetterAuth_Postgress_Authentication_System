# 🏗️ System Architecture

<div align="center">

## Understanding the System Design

**Request Flow • Authentication • Security • Patterns**

---

</div>

## 📊 Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                    (Browser/Mobile App)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Request
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1️⃣  Helmet (Security Headers)                        │  │
│  │      ├─ XSS Protection                                │  │
│  │      ├─ Clickjacking Protection                       │  │
│  │      └─ MIME Sniffing Protection                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  2️⃣  CORS (Cross-Origin Resource Sharing)            │  │
│  │      └─ Validate origin & credentials                │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  3️⃣  Request Logger (Development)                     │  │
│  │      └─ Log method, URL, status, duration            │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  4️⃣  Rate Limiter                                     │  │
│  │      ├─ API: 100 req/15min                           │  │
│  │      └─ Auth: 5 req/15min                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  5️⃣  Body Parser (JSON/URL-encoded)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  6️⃣  Cookie Parser                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  7️⃣  Routes                                            │  │
│  │      ├─ /api/v1/auth                                  │  │
│  │      ├─ /api/v1/users                                 │  │
│  │      └─ /api/v1/health                                │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  8️⃣  Authentication (checkAuth) - If Protected        │  │
│  │      ├─ Verify session token                          │  │
│  │      ├─ Verify JWT access token                       │  │
│  │      └─ Check user role                               │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  9️⃣  Validation (Zod Schema)                          │  │
│  │      └─ Validate request body                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🔟 Controller                                         │  │
│  │      └─ Handle request, call service                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1️⃣1️⃣ Service (Business Logic)                         │  │
│  │      └─ Process data, interact with DB                │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1️⃣2️⃣ Database (Prisma ORM)                            │  │
│  │      └─ Execute queries, return data                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1️⃣3️⃣ Response                                         │  │
│  │      └─ Format & send response                        │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Response
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                       │
│  • User Table                                                │
│  • Session Table                                             │
│  • Account Table                                             │
│  • Verification Table                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────────┘

1️⃣  User Registers/Logs In
    ↓
2️⃣  System Generates Tokens:
    ├─ BetterAuth Session Token (1 day)
    ├─ JWT Access Token (1 day)
    └─ JWT Refresh Token (7 days)
    ↓
3️⃣  Tokens Stored in HTTP-Only Cookies
    ├─ accessToken
    ├─ refreshToken
    └─ better-auth.session_token
    ↓
4️⃣  Client Makes Requests (with cookies)
    ↓
5️⃣  Server Validates:
    ├─ Session exists in database
    ├─ Session not expired
    ├─ User status is ACTIVE
    ├─ User not deleted
    ├─ JWT signature valid
    ├─ JWT not expired
    └─ User has required role
    ↓
6️⃣  Access Token Expires?
    └─ Use Refresh Token to get new Access Token
    ↓
7️⃣  Logout
    └─ Clear all tokens & delete session
```

---

## 📁 Project Structure

```
src/
├── 📱 app/
│   ├── ⚙️ config/
│   │   └── env.ts                    # Environment validation
│   │
│   ├── ❌ errorHelpers/
│   │   ├── AppError.ts               # Custom error class
│   │   └── handleZodError.ts         # Zod error formatter
│   │
│   ├── 📚 lib/
│   │   ├── auth.ts                   # BetterAuth configuration
│   │   └── prisma.ts                 # Prisma client
│   │
│   ├── 🛡️ middleware/
│   │   ├── checkAuth.ts              # Authentication
│   │   ├── cors.ts                   # CORS config
│   │   ├── helmet.ts                 # Security headers
│   │   ├── rateLimiter.ts            # Rate limiting
│   │   ├── requestLogger.ts          # Request logging
│   │   ├── validateRequest.ts        # Input validation
│   │   ├── globalErrorHandler.ts     # Error handling
│   │   └── notFound.ts               # 404 handler
│   │
│   ├── 📦 module/
│   │   ├── auth/
│   │   │   ├── auth.service.ts       # Auth business logic
│   │   │   ├── auth.controller.ts    # Auth request handlers
│   │   │   ├── auth.route.ts         # Auth routes
│   │   │   └── auth.validation.ts    # Auth validation schemas
│   │   │
│   │   ├── user/
│   │   │   ├── user.service.ts
│   │   │   ├── user.controller.ts
│   │   │   └── user.route.ts
│   │   │
│   │   └── health/
│   │       └── health.route.ts       # Health check
│   │
│   ├── 🛣️ routes/
│   │   └── index.ts                  # Route registration
│   │
│   ├── 🔄 shared/
│   │   ├── catchAsync.ts             # Async error wrapper
│   │   └── sendResponse.ts           # Response formatter
│   │
│   └── 🛠️ utils/
│       ├── jwt.ts                    # JWT operations
│       ├── token.ts                  # Token management
│       └── cookie.ts                 # Cookie operations
│
├── 🚀 app.ts                         # Express app setup
└── 🖥️ server.ts                      # Server entry point

prisma/schema/
├── 📋 schema.prisma                  # Main schema config
├── 🔐 auth.prisma                    # Auth models
└── 🎭 enums.prisma                   # Roles & enums
```

---

## 🧩 Component Breakdown

### 🛡️ Middleware Layer

<table>
<tr>
<th>Middleware</th>
<th>Purpose</th>
<th>Order</th>
</tr>
<tr>
<td><code>helmet.ts</code></td>
<td>Security headers (XSS, clickjacking)</td>
<td>1️⃣</td>
</tr>
<tr>
<td><code>cors.ts</code></td>
<td>Cross-origin resource sharing</td>
<td>2️⃣</td>
</tr>
<tr>
<td><code>requestLogger.ts</code></td>
<td>Log requests (development)</td>
<td>3️⃣</td>
</tr>
<tr>
<td><code>rateLimiter.ts</code></td>
<td>Prevent abuse</td>
<td>4️⃣</td>
</tr>
<tr>
<td><code>checkAuth.ts</code></td>
<td>Verify authentication</td>
<td>Route-specific</td>
</tr>
<tr>
<td><code>validateRequest.ts</code></td>
<td>Validate input data</td>
<td>Route-specific</td>
</tr>
<tr>
<td><code>globalErrorHandler.ts</code></td>
<td>Handle all errors</td>
<td>Last</td>
</tr>
</table>

### 📦 Module Layer

Each module follows this structure:

```
module/
├── service.ts       # 💼 Business logic
├── controller.ts    # 🎮 Request handlers
├── route.ts         # 🛣️ Route definitions
└── validation.ts    # ✅ Zod schemas (optional)
```

### 🛠️ Utility Layer

```
utils/
├── jwt.ts           # Create, verify, decode JWT
├── token.ts         # Manage access/refresh tokens
└── cookie.ts        # Set, get, clear cookies
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────┘

Layer 1: Input Validation (Zod)
    ├─ Validate email format
    ├─ Validate password strength
    └─ Sanitize user input
    ↓
Layer 2: Authentication Check
    ├─ Verify session exists
    ├─ Verify JWT signature
    └─ Check token expiration
    ↓
Layer 3: Authorization Check (RBAC)
    ├─ Check user role
    ├─ Verify permissions
    └─ Check user status
    ↓
Layer 4: Business Logic
    ├─ Process request
    ├─ Apply business rules
    └─ Validate data integrity
    ↓
Layer 5: Database Security
    ├─ Parameterized queries (Prisma)
    ├─ SQL injection protection
    └─ Data encryption
```

---

## 🎯 Design Patterns

### 1️⃣ **MVC Pattern** (Modified)
- **Model:** Prisma schemas
- **View:** JSON responses
- **Controller:** Request handlers

### 2️⃣ **Service Layer Pattern**
- Business logic separated from controllers
- Reusable service methods
- Easy to test

### 3️⃣ **Middleware Pattern**
- Request processing pipeline
- Modular request handling
- Easy to add/remove features

### 4️⃣ **Repository Pattern** (via Prisma)
- Database abstraction
- Type-safe queries
- Easy to switch databases

### 5️⃣ **Factory Pattern**
- Token creation utilities
- Error object creation

### 6️⃣ **Singleton Pattern**
- Prisma client instance
- BetterAuth instance

---

## 🔄 Scalability

### Horizontal Scaling
```
✅ Stateless authentication (JWT)
✅ Sessions stored in database (not memory)
✅ Can run multiple server instances
✅ Load balancer ready
```

### Vertical Scaling
```
✅ Efficient database queries
✅ Indexed fields in database
✅ Connection pooling
✅ Optimized middleware
```

### Caching Strategy (Future)
```
💡 Redis for session caching
💡 Token blacklist caching
💡 User data caching
💡 Query result caching
```

---

## 🎓 Best Practices Implemented

<table>
<tr>
<td width="50%">

### ✅ **Code Quality**

✅ Separation of concerns  
✅ DRY principle  
✅ SOLID principles  
✅ Type safety (TypeScript)  
✅ Error handling at all levels  
✅ Consistent code style  

</td>
<td width="50%">

### ✅ **Security**

✅ Multiple security layers  
✅ Input validation  
✅ SQL injection protection  
✅ XSS protection  
✅ CSRF protection ready  
✅ Secure by default  

</td>
</tr>
</table>

---

## 📊 Performance Optimization

### Database
```
✅ Indexed fields (userId, email, token)
✅ Efficient queries with Prisma
✅ Connection pooling
✅ Query optimization
```

### Caching
```
✅ Cookie caching enabled
✅ Session caching (BetterAuth)
✅ Static asset caching ready
```

### Code
```
✅ Async/await for non-blocking operations
✅ Efficient error handling
✅ Type safety reduces runtime errors
✅ Minimal dependencies
```

---

<div align="center">

## 🎉 Architecture Summary

**This system is designed to be:**

✅ **Scalable** - Handle growth easily  
✅ **Maintainable** - Clean code structure  
✅ **Secure** - Multiple security layers  
✅ **Testable** - Easy to write tests  
✅ **Reusable** - Use in any project  
✅ **Production-Ready** - Deploy with confidence  

---

### 📚 Learn More

**Setup Guide** → [SETUP_GUIDE.md](SETUP_GUIDE.md)  
**API Reference** → [README.md](README.md)  
**Role Examples** → [ROLE_CUSTOMIZATION.md](ROLE_CUSTOMIZATION.md)

---

**Happy Coding! 🚀**

</div>
