const mongoose = require("mongoose");
const logger = require("./logger");

const MAX_RETRIES = parseInt(process.env.MONGODB_MAX_RETRIES, 10) || 5;
const RETRY_INTERVAL = parseInt(process.env.MONGODB_RETRY_INTERVAL, 10) || 5000;

async function connectDatabase(retries = MAX_RETRIES) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        logger.info("MongoDB Connected Successfully");
        return true;
    } catch (error) {
        logger.error(error);

        if (retries > 0) {
            logger.warn(
                `MongoDB connection failed. Retrying in ${RETRY_INTERVAL / 1000}s... (${retries} retries left)`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, RETRY_INTERVAL)
            );

            return connectDatabase(retries - 1);
        }

        logger.error("MongoDB connection failed permanently. Server will continue without DB.");

        return false;
    }
}

module.exports = connectDatabase;