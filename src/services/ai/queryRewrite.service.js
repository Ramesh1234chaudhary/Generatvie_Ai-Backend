const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const rewriteQuery = async (question) => {

    const prompt = `
Generate 5 different search queries for the following question.

Rules:

- Keep same meaning.
- Return one query per line.
- No numbering.
- No explanation.

Question:

${question}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text
        .split("\n")
        .map(query => query.trim())
        .filter(query => query.length);
};

module.exports = {
    rewriteQuery,
};