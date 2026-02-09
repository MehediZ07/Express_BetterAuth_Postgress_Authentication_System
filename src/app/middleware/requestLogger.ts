import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        const start = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - start;
            const log = {
                method: req.method,
                url: req.url,
                status: res.statusCode,
                duration: `${duration}ms`,
                ip: req.ip,
                userAgent: req.get('user-agent'),
                timestamp: new Date().toISOString(),
            };
            
            console.log(JSON.stringify(log, null, 2));
        });
    }
    
    next();
};
