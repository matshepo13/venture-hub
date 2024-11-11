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
                <div class="bot-avatar">
                    <i data-lucide="bot" size="24"></i>
                </div>
                <span class="bot-name">Venture-Bot</span>
            </div>
            <div class="response-content">`;

        // Format the greeting and assessment
        let formattedText = text.replace(/(EXCELLENT|GOOD|FAIR)/g, '<span class="assessment-$1">$1</span>');

        // Format section headers with icons
        const sectionIcons = {
            'Market Need': 'target',
            'Innovative Solution': 'lightbulb',
            'Business Model': 'briefcase',
            'Implementation Plan': 'git-branch',
            'Recommendations': 'check-circle'
        };

        Object.entries(sectionIcons).forEach(([section, icon]) => {
            formattedText = formattedText.replace(
                new RegExp(`${section}`, 'g'),
                `<h3 class="section-header">
                    <i data-lucide="${icon}" size="20"></i>
                    ${section}
                </h3>`
            );
        });

        // Format bullet points
        formattedText = formattedText.replace(/•(.*)/g, '<div class="bullet-point"><i data-lucide="check" size="16"></i>$1</div>');

        return `${intro}${formattedText}</div></div>`;
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