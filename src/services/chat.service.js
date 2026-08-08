const { GoogleGenAI } = require("@google/genai");

const { retrieveDocuments } = require("./ai/retrieval.service");
const { rewriteQuery } = require("./ai/queryRewrite.service");
const { ragPrompt } = require("./ai/prompt.service");
const { validateQuestion } = require("./ai/security.service");
const {
    compressContext,
} = require("./ai/compression.service");

const { rerankChunks } = require("./ai/rerank.service");
const chatRepository = require("../repositories/chat.repository");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const askQuestion = async (question, user, searchDepartment = null) => {

    const department = searchDepartment || user.department;

    // If no department available (e.g., ADMIN without department), return error
    if (!department) {
        return {
            answer: "Please select a department to query or assign yourself to a department first.",
            sources: [],
        };
    }

    // 1. Security Check
    validateQuestion(question);

    // 2. Rewrite User Query
    const queries = await rewriteQuery(question);

    console.log("Generated Queries:", queries.length);

    // 3. Parallel Retrieval from Pinecone
    const results = await Promise.all(

        queries.map(query =>
            retrieveDocuments(
                query,
                department
            )
        )

    );

    console.log("Retrieved", results.flat().length, "total matches");

    // 4. Merge Results
    let matches = results.flat();

    // 5. Remove Duplicate Chunks
    matches = [
        ...new Map(
            matches.map(item => [
                item.id,
                item
            ])
        ).values()
    ];

    // 6. Sort by Similarity Score
    matches.sort((a, b) => b.score - a.score);

    // 7. Keep Top 5 Chunks
    matches = matches.slice(0, 5);

    matches = await compressContext(
    question,
    matches
);


matches = await rerankChunks(
    question,
    matches
);

console.log("After Reranking :", matches.length);
console.log("Compressed Chunks :", matches.length);

    // 8. No Result Found
    if (!matches.length) {

        return {
            answer:
                "I couldn't find any relevant information in the uploaded documents.",
            sources: [],
        };

    }

    // 9. Build Context
    const context = matches
        .map((item, index) => {

            return `
Document ${index + 1}

Source : ${item.metadata.source}

Page : ${item.metadata.page}

${item.metadata.text}
`;

        })
        .join("\n\n-----------------------------\n\n");

    // 10. Prepare Sources
    const sources = matches.map(item => ({

        source: item.metadata.source,

        page: item.metadata.page,

    }));

    // 11. Remove Duplicate Sources
    const uniqueSources = [

        ...new Map(

            sources.map(item => [

                `${item.source}_${item.page}`,

                item

            ])

        ).values()

    ];

    // 12. Create Prompt
    const prompt = await ragPrompt.format({

        context,

        question,

    });

    // 13. Ask Gemini
    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: prompt,

    });

    const answerText = response.text || response.content?.parts?.[0]?.text || "Unable to generate response";

    // Save to chat history (non-blocking)
    try {
        await chatRepository.create({
            user: user._id,
            question,
            answer: answerText,
            sources: uniqueSources,
        });
    } catch (error) {
        console.error("Failed to save chat history:", error.message);
        // Continue anyway - don't fail the request
    }

    // 14. Return Final Response
    return {

        answer: answerText,

        sources: uniqueSources,

    };

};


const getChatHistory = async (userId) => {
    const chats = await chatRepository.getUserHistory(userId);
    return chats;
};

const clearChatHistory = async (userId) => {
    await chatRepository.deleteUserHistory(userId);
    return { success: true };
};

module.exports = {
    askQuestion,
    getChatHistory,
    clearChatHistory,
};