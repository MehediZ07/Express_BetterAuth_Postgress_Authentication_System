import app from "./app";
import { envVars } from "./app/config/env";
import { prisma } from "./app/lib/prisma";

let server: any;

const bootstrap = async () => {
    try {
        server = app.listen(envVars.PORT, () => {
            console.log(`✅ Server is running on http://localhost:${envVars.PORT}`);
            console.log(`✅ Environment: ${envVars.NODE_ENV}`);
            console.log(`✅ Health check: http://localhost:${envVars.PORT}/api/v1/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    if (server) {
        server.close(async () => {
            console.log('✅ HTTP server closed');
            
            try {
                await prisma.$disconnect();
                console.log('✅ Database connection closed');
                process.exit(0);
            } catch (error) {
                console.error('❌ Error during shutdown:', error);
                process.exit(1);
            }
        });
    }
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
    gracefulShutdown('unhandledRejection');
});

bootstrap();
