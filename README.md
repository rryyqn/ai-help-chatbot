# AI Chatbot with Arcjet Protection

A Next.js AI chatbot application with advanced security features powered by Arcjet for rate limiting and bot protection.

## Features

- 🤖 AI-powered chat interface using Google's Gemini model
- 🛡️ **Arcjet-powered security** with rate limiting and bot protection
- 🔒 CSRF protection and content validation
- 📱 Responsive UI with modern design
- ⚡ Real-time streaming responses

## Security Features

This application uses [Arcjet](https://arcjet.com) for comprehensive API protection:

- **Rate Limiting**: Sliding window and token bucket algorithms
- **Bot Protection**: Advanced bot detection with configurable allow/deny lists
- **Shield WAF**: Protection against common web attacks
- **Real-time Monitoring**: Detailed logging and analytics

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Google AI SDK
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key

# Arcjet (Required for rate limiting and bot protection)
ARCJET_KEY=your_arcjet_site_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting Arcjet Key

1. Sign up at [https://app.arcjet.com](https://app.arcjet.com)
2. Create a new site
3. Copy your site key to `ARCJET_KEY`

## Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## Rate Limiting Configuration

The application uses multiple rate limiting strategies:

- **Sliding Window**: 8 requests per 30 seconds
- **Token Bucket**: 10 tokens capacity, 2 tokens refill per 10 seconds

## Bot Protection

Arcjet automatically detects and blocks:
- Automated bots and scrapers
- Malicious user agents
- Suspicious request patterns

Search engine bots (Google, Bing) are allowed by default.

## API Endpoints

- `POST /api/chat` - Main chat endpoint with Arcjet protection

## Testing

Test the rate limiting with curl:

```bash
## This should return 403 (bot detected)
curl -v -H "Content-Type: application/json" \
  -H "Referer: http://localhost:3000" \
  -d '{"messages":[]}' \
  http://localhost:3000/api/chat
```

## Deployment

The application is ready for deployment on Vercel, Netlify, or any Next.js-compatible platform. Make sure to set all required environment variables in your deployment environment.
