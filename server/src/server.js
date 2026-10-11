import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

async function startServer() {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Start HTTP server
    const server = app.listen(ENV.PORT, () => {
      console.log(`[SprintDesk Server] Running on http://localhost:${ENV.PORT} [${ENV.NODE_ENV}]`);
      console.log(`[SprintDesk Server] Health Check: http://localhost:${ENV.PORT}/api/health`);
    });

    // 3. Graceful shutdown listeners
    const shutdown = (signal) => {
      console.log(`\n[SprintDesk Server] Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('[SprintDesk Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[SprintDesk Server] Fatal Startup Failure:', error);
    process.exit(1);
  }
}

startServer();
