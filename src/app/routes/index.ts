import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { HealthRoutes } from "../module/health/health.route";
import { UserRoutes } from "../module/user/user.route";

const router = Router();

router.use("/", HealthRoutes);
router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);

export const IndexRoutes = router;
