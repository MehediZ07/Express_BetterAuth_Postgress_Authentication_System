# 🎭 Role Customization Guide

<div align="center">

## Customize User Roles for Any Project

**E-commerce • Healthcare • Education • SaaS • And More!**

---

</div>

## 🎯 Why Customize Roles?

Different projects need different user types. This system is designed to be flexible!

```
┌──────────────────────────────────────────────────────────┐
│  ⚠️  IMPORTANT: Customize roles BEFORE first migration!  │
│                                                           │
│  Changing roles after migration requires data migration  │
│  and can be complex. Plan your roles upfront! 📋         │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Quick Customization Steps

```
1️⃣ Edit prisma/schema/enums.prisma
   └─ Define your roles

2️⃣ Edit prisma/schema/auth.prisma
   └─ Set default role

3️⃣ Edit src/app/lib/auth.ts
   └─ Update BetterAuth config

4️⃣ Run migrations
   └─ npm run generate && npm run migrate
```

---

## 🎯 Role Examples by Industry

### 🛒 **E-Commerce Platform**

```prisma
enum Role {
    SUPER_ADMIN          // Platform owner
    ADMIN                // Platform managers
    VENDOR               // Sellers/merchants
    CUSTOMER             // Buyers
    SUPPORT_AGENT        // Customer service
}
```

**Default Role:** `CUSTOMER`

**Use Cases:**
- Online stores
- Marketplaces
- Multi-vendor platforms
- B2B/B2C platforms

---

### 🏥 **Healthcare System**

```prisma
enum Role {
    SUPER_ADMIN          // System administrator
    ADMIN                // Hospital administrators
    DOCTOR               // Medical practitioners
    NURSE                // Nursing staff
    PATIENT              // Patients
    PHARMACIST           // Pharmacy staff
}
```

**Default Role:** `PATIENT`

**Use Cases:**
- Patient portals
- Hospital management
- Telemedicine apps
- Clinic systems

---

### 🎓 **Education Platform**

```prisma
enum Role {
    SUPER_ADMIN          // Platform owner
    ADMIN                // School administrators
    TEACHER              // Instructors
    STUDENT              // Learners
    PARENT               // Student guardians
    COORDINATOR          // Academic coordinators
}
```

**Default Role:** `STUDENT`

**Use Cases:**
- Learning management systems
- Online courses
- School portals
- Training platforms

---

### 💼 **SaaS Application**

```prisma
enum Role {
    SUPER_ADMIN          // Platform owner
    ADMIN                // Platform managers
    ORGANIZATION_OWNER   // Company owners
    TEAM_MEMBER          // Team users
    VIEWER               // Read-only access
}
```

**Default Role:** `TEAM_MEMBER`

**Use Cases:**
- Business applications
- Team collaboration tools
- Project management
- CRM systems

---

### 🏠 **Real Estate Platform**

```prisma
enum Role {
    SUPER_ADMIN          // Platform owner
    ADMIN                // Platform managers
    AGENT                // Real estate agents
    PROPERTY_OWNER       // Property owners
    BUYER                // Property buyers
    TENANT               // Renters
}
```

**Default Role:** `BUYER`

**Use Cases:**
- Property listings
- Rental platforms
- Agent portals
- Property management

---

### 🍔 **Food Delivery App**

```prisma
enum Role {
    SUPER_ADMIN          // Platform owner
    ADMIN                // Platform managers
    RESTAURANT_OWNER     // Restaurant owners
    DELIVERY_PARTNER     // Delivery drivers
    CUSTOMER             // Food orderers
}
```

**Default Role:** `CUSTOMER`

**Use Cases:**
- Food delivery platforms
- Restaurant management
- Order tracking
- Delivery systems

---

### 💼 **Job Portal**

```prisma
enum Role {
    SUPER_ADMIN          // Platform owner
    ADMIN                // Platform managers
    EMPLOYER             // Companies
    JOB_SEEKER           // Job applicants
    RECRUITER            // Recruitment agencies
}
```

**Default Role:** `JOB_SEEKER`

---

### 🏨 **Hotel Booking System**

```prisma
enum Role {
    SUPER_ADMIN          // Platform owner
    ADMIN                // Platform managers
    HOTEL_MANAGER        // Hotel managers
    STAFF                // Hotel staff
    GUEST                // Hotel guests
}
```

**Default Role:** `GUEST`

---

### 💻 **Freelance Platform**

```prisma
enum Role {
    SUPER_ADMIN          // Platform owner
    ADMIN                // Platform managers
    FREELANCER           // Service providers
    CLIENT               // Service buyers
    AGENCY               // Agencies
}
```

**Default Role:** `CLIENT`

---

## 🔧 Implementation Steps

### Step 1: Update Enums

**File:** `prisma/schema/enums.prisma`

```prisma
enum Role {
    SUPER_ADMIN
    ADMIN
    YOUR_ROLE_1
    YOUR_ROLE_2
    YOUR_ROLE_3
}
```

### Step 2: Update User Model Default

**File:** `prisma/schema/auth.prisma`

```prisma
model User {
    id                 String     @id
    name               String
    email              String
    emailVerified      Boolean    @default(false)
    role               Role       @default(YOUR_DEFAULT_ROLE)  // 👈 Change this
    status             UserStatus @default(ACTIVE)
    // ... rest of fields
}
```

### Step 3: Update BetterAuth Config

**File:** `src/app/lib/auth.ts`

```typescript
user: {
    additionalFields: {
        role: {
            type: "string",
            required: true,
            defaultValue: Role.YOUR_DEFAULT_ROLE  // 👈 Change this
        },
        // ... rest of fields
    }
}
```

### Step 4: Run Migration

```bash
npm run generate
npm run migrate
```

---

## 🛡️ Using Roles in Your Routes

### Any Authenticated User

```typescript
import { checkAuth } from "./middleware/checkAuth";

router.get("/profile", checkAuth(), controller.getProfile);
```

### Specific Role Only

```typescript
import { Role } from "../generated/prisma/enums";

// Only ADMIN can access
router.get("/admin-panel", checkAuth(Role.ADMIN), controller.adminPanel);

// Only DOCTOR can access
router.get("/patients", checkAuth(Role.DOCTOR), controller.getPatients);
```

### Multiple Roles

```typescript
// ADMIN or SUPER_ADMIN can access
router.delete("/users/:id", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    controller.deleteUser
);

// DOCTOR or NURSE can access
router.get("/medical-records/:id", 
    checkAuth(Role.DOCTOR, Role.NURSE), 
    controller.getMedicalRecords
);
```

---

## 🎓 Best Practices

<table>
<tr>
<td width="50%">

### ✅ **DO**

✅ Always keep `SUPER_ADMIN` for system access  
✅ Use descriptive role names (DOCTOR not TYPE1)  
✅ Plan role hierarchy upfront  
✅ Document role permissions  
✅ Use UPPER_SNAKE_CASE naming  
✅ Think about future requirements  

</td>
<td width="50%">

### ❌ **DON'T**

❌ Use generic names (TYPE1, TYPE2)  
❌ Change roles after migration  
❌ Create too many roles initially  
❌ Forget to update default role  
❌ Skip role documentation  
❌ Use inconsistent naming  

</td>
</tr>
</table>

---

## 📊 Role Hierarchy Example

```
SUPER_ADMIN (Highest Authority)
    ↓
ADMIN (Platform Management)
    ↓
MANAGER (Department Management)
    ↓
USER (Regular User)
    ↓
GUEST (Limited Access)
```

---

## 💡 Pro Tips

```
💡 Start Simple
   Begin with basic roles, add more as needed

💡 Think Long-term
   Consider future requirements when planning

💡 Be Consistent
   Use same naming convention throughout

💡 Test Thoroughly
   Test all role-based access controls

💡 Document Well
   Keep track of what each role can do
```

---

## 🔄 Changing Roles After Migration

If you need to change roles after initial migration:

```bash
# Create a new migration
npm run prisma migrate dev --name update_roles

# Or reset database (⚠️ WARNING: Deletes all data)
npm run prisma migrate reset
```

---

## 📝 Role Permission Documentation Template

Create a `PERMISSIONS.md` file in your project:

```markdown
# Role Permissions

## SUPER_ADMIN
- ✅ Full system access
- ✅ Manage all users
- ✅ System configuration
- ✅ View all data

## ADMIN
- ✅ Manage users
- ✅ View reports
- ✅ Moderate content
- ❌ System configuration

## USER
- ✅ View own profile
- ✅ Update own data
- ❌ Manage other users
- ❌ View reports
```

---

## 🎯 Quick Reference Table

| Project Type | Common Roles | Default Role |
|-------------|--------------|--------------|
| E-commerce | VENDOR, CUSTOMER | CUSTOMER |
| Healthcare | DOCTOR, PATIENT | PATIENT |
| Education | TEACHER, STUDENT | STUDENT |
| SaaS | OWNER, MEMBER | MEMBER |
| Real Estate | AGENT, BUYER | BUYER |
| Food Delivery | RESTAURANT, CUSTOMER | CUSTOMER |
| Job Portal | EMPLOYER, JOB_SEEKER | JOB_SEEKER |

---

<div align="center">

## 🎉 Ready to Customize!

**Remember:** The beauty of this system is its flexibility.  
One authentication setup, infinite possibilities!

---

### 📚 Next Steps

**1.** Choose your roles from examples above  
**2.** Follow implementation steps  
**3.** Run migrations  
**4.** Start building! 🚀

---

**Happy Coding! 🎊**

</div>
