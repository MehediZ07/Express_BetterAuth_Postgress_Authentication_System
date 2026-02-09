import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.get("/health", async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        
        res.status(200).json({
            success: true,
            message: "System is healthy",
            data: {
                status: "UP",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: "Connected",
                memory: {
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                    unit: "MB"
                }
            }
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: "System is unhealthy",
            data: {
                status: "DOWN",
                timestamp: new Date().toISOString(),
                database: "Disconnected",
                error: error instanceof Error ? error.message : "Unknown error"
            }
        });
    }
});

export const HealthRoutes = router;
