require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: "Hello World",
    });

    console.log("Dimension:", response.embeddings[0].values.length);
}

main().catch(console.error);