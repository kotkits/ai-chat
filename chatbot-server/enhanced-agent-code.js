const fetch = require('node-fetch');

const servicesCatalog = [
    {
        id: "it-consulting",
        name: "IT Consulting",
        link: "https://tigernethost.com/services/",
        keywords: ["it consulting", "tech support", "consulting", "consultation", "consultant", "technical advice", "it strategy", "it consultation"],
        features: ["Strategic planning", "Infrastructure assessment", "Security review", "Digital transformation"],
        bestFor: ["growing businesses", "digital transformation", "cybersecurity planning"],
        description: "Expert IT consulting services to optimize your technology infrastructure and drive business growth.",

    },
    {
        id: "app-development",
        name: "Application Development",
        link: "https://tigernethost.com/services/",
        keywords: ["application development", "app development", "software development", "custom software", "custom application", "web app", "mobile app"],
        features: ["Custom solutions", "Web & mobile apps", "UI/UX design", "API integration"],
        bestFor: ["businesses needing custom solutions", "process automation", "customer engagement"],
        description: "Tailored software development services to create powerful applications that solve your unique business challenges.",

    },
    {
        id: "web-hosting",
        name: "Web Hosting",
        link: "https://tigernethost.com/hosting",
        keywords: ["hosting", "web hosting", "server", "domain hosting", "site hosting", "host"],
        features: ["99.9% uptime", "SSD storage", "24/7 support"],
        bestFor: ["small businesses", "personal websites", "blogs"],
        description: "Reliable and secure hosting solutions to power your websites and apps with guaranteed uptime and performance.",

    },
    {
        id: "domain-registration",
        name: "Domain Registration",
        link: "https://tigernethost.com/",
        keywords: ["domain", "domains", "website name", "url", "web address", "domain name"],
        features: ["Auto-renewal", "Domain management"],
        bestFor: ["new businesses", "startups", "rebranding"],
        description: "Register your perfect domain name at competitive prices with our easy-to-use domain management system.",

    },
    {
        id: "cybersecurity",
        name: "Cybersecurity Solutions",
        link: "https://tigernethost.com/services/",
        keywords: ["cybersecurity", "cybersecurity solutions", "security solutions", "security services", "data protection", "network security", "information security"],
        features: ["Security audits", "Vulnerability Scan", "Compliance assistance", "Malware protection"],
        bestFor: ["businesses with sensitive data", "financial services", "healthcare", "e-commerce"],
        description: "Comprehensive security solutions to protect your digital assets from threats and ensure business continuity.",

    },
    {
        id: "cloud-solutions",
        name: "Cloud Solutions",
        link: "https://tigernethost.com/services/",
        keywords: ["cloud solutions", "cloud services", "cloud migration", "aws", "azure", "cloud hosting"],
        features: ["Cloud migration", "Infrastructure optimization", "Managed cloud services", "Hybrid cloud"],
        bestFor: ["remote teams", "scalable operations", "cost optimization"],
        description: "Harness the power of cloud technology for enhanced scalability, flexibility, and efficiency in your operations.",
    }
];

class AIAgent {
    constructor() {
        this.servicesCatalog = servicesCatalog;
        this.userProfile = {};
        this.conversationContext = {};
        this.chatHistory = [];
    }
    async getAIResponse(message) {
        try {
            this.chatHistory.push({ role: 'user', content: message });

            const recentHistory = this.chatHistory.slice(-10); // Keep the last 10 messages only for context.

            const apiKey = process.env.MISTRAL_API_KEY;
            if (!apiKey) {
                console.error("❌ ERROR: No API key available");
                return "I'm sorry, but I can't process this request at the moment.";
            }

            const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistral-medium",
                    messages: recentHistory,
                    max_tokens: 1200,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ ERROR: Mistral API request failed!", errorText);
                return "I'm sorry, our AI service is unavailable. Please try again later.";
            }

            const data = await response.json();
            const aiReply = data.choices?.[0]?.message?.content?.trim() || "";
            this.chatHistory.push({ role: 'assistant', content: aiReply });

            return aiReply;
        } catch (err) {
            console.error("❌ ERROR in getAIResponse:", err);
            return "I'm having trouble processing your request right now. Please try again.";
        }
    }


    async getSingleShotResponse(rawMessage) {
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            console.error("❌ ERROR: No API key available");
            return "I'm sorry, but I can't process this request at the moment due to a configuration issue.";
        }

        try {
            const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "mistral-medium",
                    messages: [{ role: 'user', content: rawMessage }],
                    max_tokens: 1200,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ ERROR: Mistral API request failed!", errorText);
                return "I'm sorry, our AI service is unavailable. Please try again later.";
            }

            const data = await response.json();
            const aiReply = data.choices?.[0]?.message?.content?.trim() || "";
            return aiReply;
        } catch (err) {
            console.error("❌ ERROR in getSingleShotResponse:", err);
            return "I'm having trouble connecting to our AI service. Please try again later.";
        }
    }


    async processUserMessage(userMessage) {
        try {
            if (typeof userMessage !== 'string') {
                userMessage = '';
            }

            const msg = userMessage.trim();
            this.updateContext(msg);

            const intents = this.detectMultipleIntents(msg);
            const relevant = this.findRelevantServices(msg);

            if (intents.includes('comparison_request')) {
                return await this.handleComparisonRequest(msg);
            }

            if (intents.includes('greeting') && intents.includes('service_inquiry')) {
                const greet = this.handleGreeting().replace(/[.?!]$/, '');
                const svcResp = await this.handleServiceInquiry(msg);
                const combined = `${greet}!\n\n${svcResp}`;
                this.chatHistory.push({ role: 'assistant', content: combined });
                return combined;
            }

            if (intents.includes('greeting')) {
                const greetOnly = this.handleGreeting();
                this.chatHistory.push({ role: 'assistant', content: greetOnly });
                return greetOnly;
            }

            if (intents.includes('service_inquiry')) {
                const resp = await this.handleServiceInquiry(msg);
                this.chatHistory.push({ role: 'assistant', content: resp });
                return resp;
            }

            if (relevant.length > 0 && !this.isGeneralServicesQuery(msg)) {
                return await this.handleSpecificServiceInquiry(relevant[0], msg);
            }

            if (relevant.length === 0 && this.conversationContext.mentionedServices?.length === 1) {
                this.chatHistory.push({ role: 'user', content: msg });
                const aiReply = await this.getSingleShotResponse(msg);
                this.chatHistory.push({ role: 'assistant', content: aiReply });
                return aiReply;
            }

            if (intents.includes('technical_question')) {
                return await this.handleTechnicalQuestion(msg);
            }

            if (relevant.length === 0) {
                return await this.handleNonServiceQuery(msg);
            }

            const recs = this.generateRecommendation();
            this.chatHistory.push({ role: 'assistant', content: recs });
            return recs;

        } catch (err) {
            console.error('❌ Error in processUserMessage:', err);
            return "I apologize, but I'm having trouble processing your request right now.";
        }
    }



    isGeneralServicesQuery(message) {
        const generalPatterns = [
            /services|what (do|can) you (offer|provide)|tell me about your services|show me your services|list (?:of )?services|all services|available services|your services/i
        ];

        return generalPatterns.some(pattern => pattern.test(message));
    }


    async handleNonServiceQuery(message) {
        console.log("🔍 Handling non-service query:", message);

        const prompt = `answer the question professionally and short .
       dont add special characters in the answer.
        User query: ${message}`;

        try {
            const aiResponse = await this.getAIResponse(prompt);
            return aiResponse || "I'm not quite sure how to answer that. Is there something specific about our IT services you'd like to know?";
        } catch (error) {
            console.error("❌ Error getting AI response for general query:", error);
            return "I'm sorry, I couldn't process that request right now. Is there something about our IT services I can help you with?";
        }
    }

    async handleTechnicalQuestion(message) {
        console.log("🔍 Handling technical question:", message);

        const prompt = `The following is a technical question related to IT, software, hosting, or other technical services offered by TigerNetHost. 
        Provide a clear, accurate, and professional response. If the question is highly specific, use your knowledge to give a helpful answer. 
        If appropriate, relate the answer to TigerNetHost's services (e.g., IT consulting, cybersecurity, web hosting) and suggest how we can assist further. 
        Keep the tone friendly and supportive.

        User question: ${message}`;

        try {
            const aiResponse = await this.getAIResponse(prompt);
            let response = `${aiResponse}\n\n`;

            if (this.userProfile.businessSize || this.userProfile.industry) {
                response += "Based on your ";
                if (this.userProfile.businessSize) {
                    response += `${this.userProfile.businessSize} business`;
                }
                if (this.userProfile.industry) {
                    response += ` in the ${this.userProfile.industry} industry`;
                }
                response += ", our IT Consulting or Cybersecurity Solutions might help address similar technical needs. ";
            }

            return response;
        } catch (error) {
            console.error("❌ Error handling technical question:", error);
            return "I'm sorry, I couldn't process your technical question right now. Could you clarify or ask something else about our services?";
        }
    }

    async handleSpecificServiceInquiry(service, userMessage) {
        // Build a single, focused prompt using the service info
        const prompt = `
        You are an expert at TigerNetHost.
        Service: "${service.name}"

        Answer based only on the above service details.
        Provide a concise list of 6–7 steps.
        At the end, include this URL: ${service.link}
        Do not use emojis or asterisks.
        `.trim();

        const aiAnswer = await this.getAIResponse(prompt);

        return [
            `✨ ${service.name}`,
            ``,
            aiAnswer,
            `\nLearn more: ${service.link}`
        ].join('\n');


    }

    handleGreeting() {
        const greetings = [
            "Hello! How can I help you with services today?",
            "Hi there! Welcome! . What can I assist you with?",
            "Greetings! I'm here to help you with our IT services. What information are you looking for?",
            "Welcome! How can I assist you with your IT needs today?"
        ];

        return this.getRandomElement(greetings);
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    detectMultipleIntents(userMessage) {
        const msg = userMessage.toLowerCase();
        let detectedIntents = [];

        // Define various intent patterns
        const intentPatterns = [
            { intent: "greeting", pattern: /^(hello|hi|hey|yo|howdy)(\s|$)/i },
            { intent: "service_inquiry", pattern: /(services|what (do|can) you (offer|provide))/i },
            { intent: "comparison_request", pattern: /(compare|difference between|which is better)/i },
            { intent: "technical_question", pattern: /(help|issue|problem|support|assist|troubleshoot)/i },
        ];


        intentPatterns.forEach(item => {
            if (item.pattern.test(msg)) {
                detectedIntents.push(item.intent);
            }
        });

        return detectedIntents.length > 0 ? detectedIntents : ["general"];
    }

    updateContext(message) {
        const msg = message.toLowerCase();

        const sizePatterns = {
            small: /\b(small business|startup|freelancer|solo|just me)\b/i,
            medium: /\b(medium business|mid-size|growing|team of \d+)\b/i,
            large: /\b(large business|enterprise|corporation|multinational)\b/i
        };
        for (const [size, re] of Object.entries(sizePatterns)) {
            if (re.test(msg)) {
                this.userProfile.businessSize = size;
                console.log(`✅ DETECTED BUSINESS SIZE: ${size}`);
                break;
            }
        }

        const mentioned = new Set();
        if (!this.conversationContext.mentionedServices) {
            this.conversationContext.mentionedServices = [];
        }
        const generalInquiryPattern = /\b(all services|list of services|everything you offer|tell me about your services)\b/;
        if (generalInquiryPattern.test(msg)) {
            this.servicesCatalog.forEach(s => mentioned.add(s.id));
        } else {
            this.servicesCatalog.forEach(service => {
                for (const keyword of service.keywords) {
                    if (msg.includes(keyword)) {
                        mentioned.add(service.id);
                        break;
                    }
                }
            });
        }
        if (mentioned.size > 0) {
            this.conversationContext.mentionedServices = Array.from(mentioned);
        }
    }


    async handleServiceInquiry(message) {

        let recommendedServices = [];
        const isAllServicesRequest = this.isGeneralServicesQuery(message);

        if (isAllServicesRequest) {

            recommendedServices = this.servicesCatalog;

            let contextNotes = "";
            if (this.userProfile.businessSize || this.userProfile.industry) {
                contextNotes += "Note: Based on your profile";
                if (this.userProfile.businessSize) {
                    contextNotes += ` as a ${this.userProfile.businessSize} business`;
                }
                if (this.userProfile.industry) {
                    contextNotes += ` in ${this.userProfile.industry}`;
                }
                contextNotes += ", I've highlighted services that might be particularly relevant to your needs.";
            }

            let response = "*Our Services at TigerNetHost*\n\n";
            if (contextNotes) {
                response += `${contextNotes}\n\n`;
            }

            for (const service of recommendedServices) {
                let isRecommended = false;

                if (this.userProfile.businessSize) {
                    isRecommended = service.bestFor.some(category =>
                        category.includes(this.userProfile.businessSize)
                    );
                }

                if (this.userProfile.industry) {
                    isRecommended = isRecommended ||
                        service.description.toLowerCase().includes(this.userProfile.industry.toLowerCase()) ||
                        service.bestFor.some(category =>
                            category.toLowerCase().includes(this.userProfile.industry.toLowerCase())
                        );
                }

                const serviceName = isRecommended ?
                    `✅ ${service.name} (Recommended for your business)` :
                    `*${service.name}*`;

                response += ` ${serviceName}\n`;
                response += `${service.description}\n\n`;
                response += `Best for: ${service.bestFor.join(', ')}\n`;

                response += `\nWebsite: ${service.link}\n\n`;

            }

            return response;

        } else {
            const relevantServices = this.findRelevantServices(message);
            if (relevantServices.length === 1) {
                // Pass the message through for context
                return this.handleSpecificServiceInquiry(relevantServices[0], message);
            } else if (relevantServices.length > 1) {
                let response = `I found several services that match your inquiry:\n\n`;
                relevantServices.forEach(service => {
                    response += `**${service.name}**: ${service.description}\n\n`;
                });
                return response;
            }
        }
        return this.generateRecommendation();
    }

    findRelevantServices(message) {
        const messageLower = message.toLowerCase();

        // Comprehensive service keyword mapping
        const serviceKeywordMap = {
            "web hosting": ["web-hosting"],
            "hosting": ["web-hosting"],
            "domain": ["domain-registration"],
            "domain registration": ["domain-registration"],
            "it consulting": ["it-consulting"],
            "consulting": ["it-consulting"],
            "app development": ["app-development"],
            "application development": ["app-development"],
            "cybersecurity": ["cybersecurity"],
            "security": ["cybersecurity"],
            "cloud": ["cloud-solutions"],
            "cloud solutions": ["cloud-solutions"]
        };

        // Exact service match first
        for (const [keyword, serviceIds] of Object.entries(serviceKeywordMap)) {
            if (messageLower.includes(keyword)) {
                const matchedServices = this.servicesCatalog.filter(service =>
                    serviceIds.includes(service.id)
                );

                if (matchedServices.length > 0) {
                    return matchedServices;
                }
            }
        }

        const scoredServices = this.servicesCatalog.map(service => {
            let score = 0;

            service.keywords.forEach(keyword => {
                const keywordStr = keyword instanceof RegExp ? keyword.toString() : String(keyword).toLowerCase();
                if (messageLower.includes(keywordStr)) {
                    score += 10;
                }
            });

            if (messageLower.includes(service.name.toLowerCase())) {
                score += 15;
            }

            return { service, score };
        });

        const relevantServices = scoredServices
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.service);

        return relevantServices.length > 0 ? relevantServices : [];
    }

    async handleComparisonRequest(message) {
        const mentionedIds = this.conversationContext.mentionedServices || [];
        let compared = mentionedIds
            .map(id => this.servicesCatalog.find(s => s.id === id))
            .filter(Boolean);

        if (compared.length < 2) {
            compared = this.findRelevantServices(message).slice(0, 2);
        }
        if (compared.length < 2) {
            return "ask for services to compare";
        }
        const [svcA, svcB] = compared;

        const comparePrompt = `
    You are an expert at TigerNetHost.
    Compare the two services below in detail:
    - ${svcA.name}
    - ${svcB.name}
    
    For each, outline:
      • Key features
      • Ideal use cases
      • Main differences
    Then conclude with when a customer should choose one over the other.
    `;
        const aiAnswer = await this.getAIResponse(comparePrompt.trim());

        let resp = `**📊 Comparison: ${svcA.name} vs. ${svcB.name}**\n\n`;
        resp += aiAnswer + "\n\n";
        resp += "**Learn more:**\n";
        resp += `- [${svcA.name}](${svcA.link})\n`;
        resp += `- [${svcB.name}](${svcB.link})\n`;

        return resp;
    }

    generateRecommendation() {

        let recommendation = "Here are a few services you might find helpful:\n\n";

        const recommendedServices = this.servicesCatalog.slice(0, 3);

        for (const service of recommendedServices) {
            recommendation += `**${service.name}**: ${service.description}\n`;
            recommendation += `• Key features: ${service.features.join(', ')}\n\n`;
        }

        return recommendation;
    }


    buildContextualizedPrompt(message) {
        let contextualizedPrompt = `[Context: User`;

        if (this.userProfile.businessSize) {
            contextualizedPrompt += ` is a ${this.userProfile.businessSize} business`;
        }
        contextualizedPrompt += `]`;

        if (this.conversationContext.mentionedServices && this.conversationContext.mentionedServices.length > 0) {
            const serviceNames = this.conversationContext.mentionedServices
                .map(id => this.servicesCatalog.find(s => s.id === id)?.name || id)
                .filter(Boolean);

            if (serviceNames.length > 0) {
                contextualizedPrompt += ` [Interested Services: ${serviceNames.join(', ')}]`;
            }
        }

        contextualizedPrompt += `\n\nUser message: ${message}`;
        return contextualizedPrompt;
    }
}

module.exports = { AIAgent };