import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { corsOptions } from "./app/middleware/cors";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { helmetConfig } from "./app/middleware/helmet";
import { notFound } from "./app/middleware/notFound";
import { apiLimiter } from "./app/middleware/rateLimiter";
import { requestLogger } from "./app/middleware/requestLogger";
import { IndexRoutes } from "./app/routes";

const app: Application = express();

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(apiLimiter);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

// Basic route
app.get('/', async (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: 'API is working',
    })
});

app.use(globalErrorHandler)
app.use(notFound)


export default app;
