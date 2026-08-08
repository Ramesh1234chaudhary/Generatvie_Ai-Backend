const { index } = require("./pinecone.client");
const { createEmbedding } = require("./embedding.service");

const retrieveDocuments = async (
    question,
    department,
    topK = 5
) => {

    try {
        const vector = await createEmbedding(question);

        const response = await index.query({

            vector,

            topK,

            includeMetadata: true,

            filter: {
                department: {
                    $eq: department
                }
            }

        });

        return response?.matches || [];
        
    } catch (error) {
        console.error("Retrieval error:", error.message);
        throw error;
    }

};

module.exports = {
    retrieveDocuments,
};