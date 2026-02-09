import { Router } from "express";
import { authLimiter } from "../../middleware/rateLimiter";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { loginUserSchema, refreshTokenSchema, registerUserSchema } from "./auth.validation";

const router = Router()

router.post("/register", authLimiter, validateRequest(registerUserSchema), AuthController.registerUser);
router.post("/login", authLimiter, validateRequest(loginUserSchema), AuthController.loginUser);
router.post("/logout", AuthController.logoutUser);
router.post("/refresh-token", validateRequest(refreshTokenSchema), AuthController.refreshToken);

export const AuthRoutes = router;
