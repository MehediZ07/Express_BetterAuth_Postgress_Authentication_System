# ✅ Quick Start Checklist

<div align="center">

## 🚀 Get Your Auth System Running in 10 Minutes!

**Use this checklist every time you start a new project**

---

</div>

## 📋 Pre-Setup

```
┌─────────────────────────────────────────────────────────┐
│  Before You Begin                                        │
├─────────────────────────────────────────────────────────┤
│  □ Copy folder to your project location                 │
│  □ Open in your IDE (VS Code, WebStorm, etc.)          │
│  □ Ensure PostgreSQL is installed and running          │
│  □ Have Node.js 18+ installed                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎭 Step 1: Role Customization (CRITICAL!)

> ⚠️ **DO THIS FIRST!** Changing roles after migration is difficult.

### ✅ Tasks

- [ ] Open `prisma/schema/enums.prisma`
- [ ] Replace roles with your project-specific roles
  ```prisma
  enum Role {
      SUPER_ADMIN
      ADMIN
      YOUR_ROLE_1    // 👈 Change these
      YOUR_ROLE_2    // 👈 Change these
  }
  ```

- [ ] Open `prisma/schema/auth.prisma`
- [ ] Update default role in User model
  ```prisma
  role Role @default(YOUR_DEFAULT_ROLE)  // 👈 Change this
  ```

- [ ] Open `src/app/lib/auth.ts`
- [ ] Update default role in BetterAuth config
  ```typescript
  defaultValue: Role.YOUR_DEFAULT_ROLE  // 👈 Change this
  ```

**📚 Need examples?** See [ROLE_CUSTOMIZATION.md](ROLE_CUSTOMIZATION.md)

---

## 🔧 Step 2: Environment Setup

### ✅ Tasks

- [ ] Copy environment file
  ```bash
  cp .env.example .env
  ```

- [ ] Update `DATABASE_URL`
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
  ```

- [ ] Generate `BETTER_AUTH_SECRET` (32+ characters)
  ```bash
  openssl rand -base64 32
  ```

- [ ] Generate `ACCESS_TOKEN_SECRET`
  ```bash
  openssl rand -base64 32
  ```

- [ ] Generate `REFRESH_TOKEN_SECRET`
  ```bash
  openssl rand -base64 32
  ```

- [ ] Set `BETTER_AUTH_URL`
  ```env
  BETTER_AUTH_URL=http://localhost:5000
  ```

- [ ] Set `NODE_ENV` to `development`
- [ ] Set `PORT` (default: 5000)

---

## 📦 Step 3: Installation

### ✅ Tasks

- [ ] Install dependencies
  ```bash
  npm install
  ```

**⏱️ Time:** ~2 minutes

---

## 🗄️ Step 4: Database Setup

### ✅ Tasks

- [ ] Ensure PostgreSQL is running
- [ ] Create database (if not exists)
- [ ] Generate Prisma Client
  ```bash
  npm run generate
  ```

- [ ] Run migrations
  ```bash
  npm run migrate
  ```

- [ ] (Optional) Open Prisma Studio to verify
  ```bash
  npm run studio
  ```

**⏱️ Time:** ~2 minutes

---

## 🚀 Step 5: First Run

### ✅ Tasks

- [ ] Start development server
  ```bash
  npm run dev
  ```

- [ ] Open browser to http://localhost:5000
- [ ] You should see: `{"success": true, "message": "API is working"}`
- [ ] Check health endpoint: http://localhost:5000/api/v1/health

**✅ Success!** Server is running!

---

## 🧪 Step 6: Test Authentication

### ✅ Test Registration

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

- [ ] Should return success with tokens
- [ ] Check cookies in response

### ✅ Test Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

- [ ] Should return success with tokens
- [ ] Verify cookies are set

### ✅ Test Protected Route

```bash
curl -X GET http://localhost:5000/api/v1/users/USER_ID \
  -H "Cookie: accessToken=...; better-auth.session_token=..."
```

- [ ] Should return user profile
- [ ] Without cookies should return 401

---

## ✨ Success Indicators

You're ready when you see:

```
✅ Server starts without errors
✅ Database migrations completed
✅ Registration endpoint works
✅ Login endpoint works
✅ Protected routes require authentication
✅ Cookies are being set
✅ Tokens are being validated
✅ Roles are working correctly
```

---

## 🐛 Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| 🔴 Prisma Client not found | `npm run generate` |
| 🔴 Migration failed | Check DATABASE_URL, then `npm run migrate` |
| 🔴 TypeScript errors | `npm run generate` + Restart TS server |
| 🔴 Port already in use | Change `PORT` in `.env` |
| 🔴 Database connection failed | Check PostgreSQL is running |

---

## 🎯 What's Next?

<div align="center">

### 🎉 **Congratulations! Your auth system is ready!**

Now you can:

**1.** Add your custom modules  
**2.** Implement your business logic  
**3.** Build your features  
**4.** Deploy to production  

---

### 📚 Helpful Resources

**Need detailed setup?** → [SETUP_GUIDE.md](SETUP_GUIDE.md)  
**Want to understand architecture?** → [ARCHITECTURE.md](ARCHITECTURE.md)  
**Need API reference?** → [README.md](README.md)

---

### ⏱️ **Total Time: ~10 Minutes**

**Happy Coding! 🚀**

</div>
