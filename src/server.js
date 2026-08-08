require("./config/env");

const mongoose = require("mongoose");
const app = require("./app");

const logger = require("./config/logger");

const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {
    const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });

    const dbConnected = await connectDatabase();

    if (dbConnected) {
        logger.info("Database is connected and ready.");
    } else {
        logger.warn("Server is running, but database is not connected. Some features may be unavailable.");
    }

    process.on("SIGINT", async () => {
        logger.warn("Gracefully shutting down...");

        await server.close();
        await mongoose.disconnect();

        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        logger.warn("Gracefully shutting down...");

        await server.close();
        await mongoose.disconnect();

        process.exit(0);
    });
}

startServer();