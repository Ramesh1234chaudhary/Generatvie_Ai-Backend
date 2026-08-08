const { loadPdf } = require("../pdf.service");
const { createChunks } = require("../chunk.service");

const {
    createBatchEmbeddings,
} = require("./embedding.service");

const {
    upsertVectors,
} = require("./pinecone.service");

const documentRepository = require("../../repositories/document.repository");

const startIndexing = async (document) => {

    try {

        // Document indexing start
        await documentRepository.updateStatus(
            document._id,
            "INDEXING"
        );

        console.log("=== Starting Document Indexing ===");
        console.log("Document ID:", document._id);
        console.log("File Path:", document.filePath);

        // Load PDF
        const pages = await loadPdf(document.filePath);
        console.log("✓ PDF Loaded - Total pages:", pages.length);

        if (!pages || pages.length === 0) {
            throw new Error("Failed to load PDF or PDF is empty");
        }

        // Chunking
        const chunks = await createChunks(pages);
        console.log("✓ Chunks Created:", chunks.length);

        if (!chunks || chunks.length === 0) {
            throw new Error("Failed to create chunks from PDF");
        }

        // Batch Embedding
        const vectors = await createBatchEmbeddings(chunks);
        console.log("✓ Embeddings Generated:", vectors.length);

        if (!vectors || vectors.length === 0) {
            throw new Error("Failed to generate embeddings from chunks");
        }

        // Pinecone Upsert
        await upsertVectors(vectors, document);
        console.log("✓ Vectors Upserted to Pinecone");

        // Success
        await documentRepository.updateStatus(
            document._id,
            "INDEXED"
        );

        console.log("=== Document Indexed Successfully ===");

    } catch (error) {

        console.error("=== Indexing Failed ===");
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);

        await documentRepository.updateStatus(
            document._id,
            "FAILED"
        );

        throw error;
    }

};

module.exports = {
    startIndexing,
};