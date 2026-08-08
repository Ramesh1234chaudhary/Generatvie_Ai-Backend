require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function listModels() {
    try {
        console.log("Fetching available models...\n");
        const models = await ai.models.list();
        
        console.log("Models response type:", typeof models);
        console.log("Models response:", JSON.stringify(models, null, 2));
        
    } catch (error) {
        console.error("Error listing models:", error.message);
        console.error("Full error:", error);
    }
    
    process.exit(0);
}

listModels();
