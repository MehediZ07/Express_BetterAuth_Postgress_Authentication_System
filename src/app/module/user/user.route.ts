import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { UserController } from "./user.controller";

const router = Router();

// Example: Protected route that requires authentication
router.get("/:userId", checkAuth(), UserController.getUserProfile);

// Example: Admin-only route
// router.get("/admin/users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
