require("dotenv").config();

const chatService = require("./src/services/chat.service");

const testUser = {
    _id: "6a741700830ac7bd474e8981",
    name: "Test User",
    department: "LEGAL",
    role: "EMPLOYEE"
};

async function testChat() {
    try {
        console.log("Testing chat with question: 'what is my leave policy'");
        const result = await chatService.askQuestion(
            "what is my leave policy",
            testUser,
            "LEGAL"
        );
        
        console.log("\n=== SUCCESS ===");
        console.log("Answer:", result.answer);
        console.log("Sources:", result.sources);
    } catch (error) {
        console.error("\n=== ERROR ===");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
    }
    
    process.exit(0);
}

testChat();
