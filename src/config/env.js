require("dotenv").config();

const requiredEnv = [
    "PORT",
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "GEMINI_API_KEY",
    "PINECONE_API_KEY",
    "PINECONE_INDEX_NAME"
];

const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length) {
    console.error(
        `Missing environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
}

module.exports = process.env;