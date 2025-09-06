# AI Chatbot Template

A modern, customizable AI chatbot built with Next.js, Vercel AI SDK, and Google Gemini. Features include rate limiting, bot protection, and a beautiful UI.

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/rryyqn/ai-chatbot.git
cd ai-chatbot-template
pnpm install
```

### 2. Environment Setup

Create a .env.local and add your API keys:

```
- `ARCJET_KEY` - Get from [Arcjet Dashboard](https://app.arcjet.com)
- `GOOGLE_GENERATIVE_AI_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
```

### 3. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your chatbot!

## ⚙️ Customization

### Basic Configuration

Edit `lib/config.ts` to customize your chatbot:

```typescript
export const chatbotConfig = {
  // Basic info
  name: "Your AI Assistant",
  
  // Welcome message (supports {{choice:}} and {{link:}} syntax)
  welcomeMessage: "Hello! How can I help you today?",
  
  // UI customization
  ui: {
    windowTitle: "Your Assistant",
    inputPlaceholder: "Type your message...",
    avatarImage: "/your-avatar.png",
    avatarFallback: "AI",
  },
  
  // Rate limiting
  rateLimit: {
    capacity: 10,        // Bucket maximum capacity
    refillRate: 2,       // Tokens refilled per interval
    interval: 10,        // Refill interval in seconds
    minTimeBetweenMessages: 1000, // Min ms between messages
    maxMessageLength: 1000,       // Max characters per message
  },
  
  // AI configuration
  api: {
    model: "gemini-2.5-flash-lite",
    systemPrompt: "You are a helpful AI assistant...",
  },
  
  // Security settings
  security: {
    enableBotDetection: true,
    enableShield: true,
    allowedBots: [], // Empty array blocks all bots
  },
};
```

### Advanced Customization

#### Custom System Prompt

Modify the `systemPrompt` in `lib/config.ts` to change how your AI behaves:

```typescript
systemPrompt: `You are a customer service assistant for [Your Company]. 
Be helpful, professional, and friendly. When appropriate, use:
- {{choice:Option Name}} for clickable choices
- {{link:https://url.com|Button Text}} for external links`
```

#### Rate Limiting

Adjust rate limiting in `lib/config.ts`:

- **capacity**: Maximum requests allowed in a burst
- **refillRate**: How many tokens are added per interval
- **interval**: How often tokens are refilled (in seconds)

#### Security Settings

Configure security features:

- **enableBotDetection**: Block automated bots
- **enableShield**: Protect against common attacks
- **allowedBots**: Specify which bot categories to allow

## 🎨 UI Customization

### Styling

The chatbot uses Tailwind CSS. Key styling files:
- `app/globals.css` - Global styles and theme
- `components/ui/` - Reusable UI components
- `components/Chatbot.tsx` - Direct chatbot styles

### Avatar

Place your avatar image in the public folder and update the path in in `lib/config.ts`.

## 🔧 Technical Details

### Architecture

- **Frontend**: Next.js 15 with React 19
- **AI**: Vercel AI SDK with Google Gemini
- **Security**: Arcjet for rate limiting and bot protection
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion

### Key Features

- ✅ Real-time streaming responses
- ✅ Rate limiting and bot protection
- ✅ Mobile-responsive design
- ✅ Customizable UI and behavior
- ✅ TypeScript support
- ✅ Error handling and retry logic

### File Structure

```
├── app/
│   ├── api/chat/route.ts    # Chat API endpoint
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── ai-elements/         # Chat-specific components
│   ├── ui/                  # Reusable UI components
│   └── Chatbot.tsx          # Main chatbot component
├── lib/
│   ├── config.ts            # Configuration file
│   ├── arcjet.ts            # Security configuration
│   └── utils.ts             # Utility functions
└── public/                  # Static assets (AI avatar image)
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 📝 License

MIT License - feel free to use this template for your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Review the example configuration

---

**Happy coding!** 🎉