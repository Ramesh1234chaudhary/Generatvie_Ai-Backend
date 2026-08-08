const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");

const loadPdf = async (filePath) => {

    try {
        const loader = new PDFLoader(filePath);

        const documents = await loader.load();

        if (!documents || documents.length === 0) {
            throw new Error("PDF loaded but contains no content");
        }

        const textDocuments = documents.filter(
            (doc) => doc.pageContent && doc.pageContent.trim().length > 0
        );

        if (textDocuments.length === 0) {
            throw new Error("PDF contains no extractable text");
        }

        console.log(`PDF loaded successfully: ${textDocuments.length} pages with text (${documents.length - textDocuments.length} image pages skipped)`);
        
        return textDocuments;
    } catch (error) {
        console.error("PDF loading failed:", error.message);
        throw new Error(`Failed to load PDF: ${error.message}`);
    }

};

module.exports = {
    loadPdf
};