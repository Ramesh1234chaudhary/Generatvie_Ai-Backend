const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const rerankChunks = async (question, matches) => {

    if (matches.length <= 5) {
        return matches;
    }

    const chunks = matches
        .map((item, index) => {

            return `
Chunk ${index + 1}

${item.metadata.text}
`;

        })
        .join("\n\n");

    const prompt = `
You are an AI Reranker.

Question:

${question}

Below are document chunks.

Rank the BEST 5 chunks for answering the question.

Return ONLY chunk numbers.

Example:

3
1
5
2
4

Chunks:

${chunks}
`;

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: prompt,

    });

    const indexes = response.text
        .split("\n")
        .map(item => parseInt(item.trim()))
        .filter(item => !isNaN(item));

    const reranked = [];

    indexes.forEach(index => {

        if (matches[index - 1]) {
            reranked.push(matches[index - 1]);
        }

    });

    return reranked;

};

module.exports = {
    rerankChunks,
};