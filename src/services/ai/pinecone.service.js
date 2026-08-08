const { index } = require("./pinecone.client");

const upsertVectors = async (vectors, document) => {

    if (!vectors || vectors.length === 0) {
        throw new Error("No vectors provided for upserting to Pinecone");
    }

    const records = vectors.map((item, indexNumber) => {

        // Validate embedding values
        if (!Array.isArray(item.values) || item.values.length === 0) {
            throw new Error(`Invalid embedding values at index ${indexNumber}`);
        }

        // Check for NaN or Infinity
        const hasInvalidValues = item.values.some(v => !isFinite(v));
        if (hasInvalidValues) {
            throw new Error(`Embedding contains NaN or Infinity at index ${indexNumber}`);
        }

        return {
            id: `${document._id}_${indexNumber}`,

            values: item.values,

            metadata: {
                documentId: document._id.toString(),
                title: document.title,
                department: document.department,
                uploadedBy: document.uploadedBy.toString(),
                page: item.chunk.metadata.page ?? 1,
                chunkIndex: indexNumber,
                text: item.chunk.pageContent,
                source: document.originalName
            }
        };

    });

    console.log(`Upserting ${records.length} records to Pinecone...`);
    
    if (!records || records.length === 0) {
        throw new Error("No valid records to upsert");
    }

    try {
        // Pinecone SDK v8 expects { records: [...] } format
        const response = await index.upsert({ records });
        
        console.log("✓ Pinecone upsert completed successfully");
    } catch (error) {
        console.error("Pinecone upsert error:", error.message);
        throw error;
    }

};

const deleteVectors = async (documentId) => {
    try {
        await index.deleteMany({
            filter: {
                documentId: { $eq: documentId.toString() }
            }
        });
        console.log(`Pinecone vectors deleted for document: ${documentId}`);
    } catch (error) {
        console.error("Failed to delete vectors from Pinecone:", error.message);
    }
};

module.exports = {
    upsertVectors,
    deleteVectors,
};