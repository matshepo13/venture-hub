const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async analyzeContent(text, context) {
        try {
            const prompt = this.buildPrompt(context, text);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            throw new Error('AI analysis failed: ' + error.message);
        }
    }

    buildPrompt(context, text) {
        const prompts = {
            'analyze': 'Act as a business advisor. Analyze this business idea and provide detailed feedback: ',
            'evaluate': 'Act as a business consultant. Evaluate this business plan and provide comprehensive analysis: ',
            'industry': 'Act as a market research analyst. Analyze this industry data and provide insights: ',
            'analysis': 'Act as a market strategist. Review this market analysis and provide recommendations: '
        };

        return `${prompts[context] || 'Analyze the following text: '} ${text}`;
    }
}

module.exports = new AIService();