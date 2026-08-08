const blockedKeywords = [

    "ignore previous instructions",

    "ignore all instructions",

    "system prompt",

    "developer prompt",

    "reveal prompt",

    "forget previous instructions",

    "act as",

    "jailbreak",

    "bypass",

    "override"

];

const validateQuestion = (question) => {

    const lowerQuestion = question.toLowerCase();

    const blocked = blockedKeywords.find(keyword =>
        lowerQuestion.includes(keyword)
    );

    if (blocked) {
        throw new Error(
            "Prompt injection attempt detected."
        );
    }

};

module.exports = {
    validateQuestion,
};