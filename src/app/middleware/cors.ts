import cors from "cors";
import { envVars } from "../config/env";

const allowedOrigins = envVars.NODE_ENV === 'production' 
    ? (envVars.ALLOWED_ORIGINS?.split(',') || [])
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'];

export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Session-Refresh', 'X-Session-Expires-At', 'X-Time-Remaining'],
    maxAge: 86400, // 24 hours
};
