const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 100,
});

const createChunks = async (documents) => {
    if (!documents || documents.length === 0) {
        throw new Error("No documents provided for chunking");
    }

    const chunks = await textSplitter.splitDocuments(documents);
    
    if (!chunks || chunks.length === 0) {
        throw new Error("Chunking produced no results");
    }

    console.log(`Created ${chunks.length} chunks from ${documents.length} documents`);
    
    return chunks;
};

module.exports = {
    createChunks,
};