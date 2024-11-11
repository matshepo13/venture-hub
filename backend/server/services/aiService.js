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
            return this.formatResponse(context, response.text());
        } catch (error) {
            throw new Error('AI analysis failed: ' + error.message);
        }
    }

    formatResponse(context, text) {
        const intro = `<div class="ai-response">
            <div class="response-header">
                <i data-lucide="brain" size="24"></i>
                <span>Venture-Bot</span>
            </div>`;

        let formattedText = text.replace(/\n\n/g, '</p><p>');
        
        // Format bullet points
        formattedText = formattedText.replace(/•\s(.*)/g, '<li><i data-lucide="check-circle" size="16"></i>$1</li>');
        
        // Format sections
        formattedText = formattedText.replace(
            /(Market Need|Innovative Solution|Business Model|Implementation Plan|Recommendations):/g,
            '<h3><i data-lucide="target" size="20"></i> $1</h3>'
        );

        const outro = `</div>`;

        return `${intro}<div class="response-content">${formattedText}</div>${outro}`;
    }

    buildPrompt(context, text) {
        const prompts = {
            'analyze': `Act as a business advisor named "Venture-Bot". Analyze this business idea and provide detailed feedback in the following structure:
                1. Start with a friendly greeting
                2. Give an initial assessment (EXCELLENT/GOOD/FAIR)
                3. Break down the analysis into sections:
                   • Market Need
                   • Innovative Solution
                   • Business Model
                   • Implementation Plan
                   • Recommendations
                Use bullet points for key details.`,
            'evaluate': 'Act as a business consultant. Evaluate this business plan and provide comprehensive analysis: ',
            'industry': 'Act as a market research analyst. Analyze this industry data and provide insights: ',
            'analysis': 'Act as a market strategist. Review this market analysis and provide recommendations: '
        };

        return `${prompts[context] || prompts['analyze']} ${text}`;
    }
}

module.exports = new AIService();