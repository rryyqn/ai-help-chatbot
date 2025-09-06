// Configuration file for the AI Chatbot Template
// Modify these values to customize your chatbot

export const chatbotConfig = {
  // Basic chatbot information
  name: "AI Assistant",

  // Initial message (supports {{choice:}} and {{link:}} syntax)
  welcomeMessage:
    "Hello! I'm your AI Assistant. What can I help you with today? {{choice:See Features}} {{link:https://github.com/yourusername/ai-chatbot|Source Code}}",

  // UI customization
  ui: {
    // Chat window title
    windowTitle: "AI Assistant",

    // Placeholder text for input
    inputPlaceholder: "Message AI Assistant...",

    // Avatar image (place in public folder)
    avatarImage: "/ai-avatar.png",
    avatarFallback: "AI",
  },

  // Rate limiting configuration
  rateLimit: {
    // Token bucket settings
    capacity: 5, // Max request capacity
    refillRate: 2, // Tokens refilled per interval
    interval: 10, // Refill interval in seconds

    // Client-side throttling
    minTimeBetweenMessages: 1000, // Minimum time between messages (ms)
    maxMessageLength: 1000, // Max message length (characters)
  },

  // API configuration
  api: {
    // AI model provider (currently using Google Gemini)
    model: "gemini-2.5-flash-lite",

    // System prompt for the AI
    systemPrompt: `You are a helpful AI assistant on a website. Help users understand the product, which is an open source AI chatbot template. You are a version of this chatbot. The AI is built with Next.js (with tailwind for full customization), Vercel AI SDK, and Google Gemini. It can be used by developers for many purposes, including customer support, knowledge base, and sales leads. Provide clear, concise, and accurate responses to relavent questions and requests only. You have been built by rryyqn. The source code, documentation, and setup can be found at https://github.com/rryyqn/ai-chatbot

    The features include:
    - Arcjet protection for rate limiting and bot protection
    - Free AI models built with Gemini AI's API free tier
    - Users can customize the chatbot's responses
    
    When appropriate, you can use these formats. Put it at the bottom of the response:
    - {{choice:Option Name}} - Creates clickable choice buttons
    - {{link:https://url.com|Button Text}} - Creates clickable link buttons
    `,
  },

  // Security settings
  security: {
    // Enable/disable bot detection
    enableBotDetection: true,

    // Enable/disable shield protection
    enableShield: true,

    // Allowed bot categories (empty array blocks all bots)
    allowedBots: [],
  },
} as const;

export type ChatbotConfig = typeof chatbotConfig;
