const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const createEmbedding = async (text) => {

    if (!text || text.trim().length === 0) {
        throw new Error("Cannot create embedding for empty text");
    }

    try {
        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: text,
        });

        const embedding = response.embeddings[0].values;
        
        if (!Array.isArray(embedding) || embedding.length === 0) {
            throw new Error("Embedding array is empty or invalid");
        }

        console.log(`✓ Embedding created: ${embedding.length} dimensions`);
        return embedding;
        
    } catch (error) {
        console.error("Embedding creation failed:", error.message);
        console.error("Error details:", error);
        throw new Error(`Failed to create embedding: ${error.message}`);
    }
};
const createBatchEmbeddings = async (
    chunks,
    batchSize = 20
) => {

    const vectors = [];

    console.log(`Starting batch embedding for ${chunks.length} chunks (batch size: ${batchSize})`);

    for (
        let i = 0;
        i < chunks.length;
        i += batchSize
    ) {

        const batch = chunks.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);

        const batchVectors = await Promise.all(

            batch.map(async (chunk, idx) => {

                try {
                    const values = await createEmbedding(
                        chunk.pageContent
                    );

                    return {
                        values,
                        chunk
                    };
                } catch (error) {
                    console.error(`Failed to create embedding for chunk ${i + idx}:`, error.message);
                    throw error;
                }

            })

        );

        vectors.push(...batchVectors);

        console.log(
            `✓ Batch ${Math.floor(i / batchSize) + 1} completed - ${vectors.length}/${chunks.length} embeddings created`
        );
    }

    return vectors;
};

module.exports = {
    createEmbedding,
    createBatchEmbeddings
};