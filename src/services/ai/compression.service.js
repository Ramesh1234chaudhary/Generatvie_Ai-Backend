const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const compressContext = async (question, matches) => {

    const chunks = matches.map((item, index) => {

        return `
Chunk ${index + 1}

${item.metadata.text}
`;

    }).join("\n\n");

    const prompt = `
You are a Context Compression Engine.

Question:

${question}

Below are retrieved document chunks.

Select ONLY the chunks that are useful for answering the question.

Do not rewrite.

Return ONLY chunk numbers.

Example:

1
3
5

Chunks:

${chunks}
`;

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: prompt,

    });

    const selected = response.text
        .split("\n")
        .map(item => parseInt(item.trim()))
        .filter(item => !isNaN(item));

    return matches.filter((item, index) =>
        selected.includes(index + 1)
    );

};

module.exports = {
    compressContext,
};