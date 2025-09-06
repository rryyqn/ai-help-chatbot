import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { aj, getRateLimitHeaders } from "@/lib/arcjet";
import { chatbotConfig } from "@/lib/config";
import { headers } from "next/headers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Content validation
const validateMessages = (messages: UIMessage[]): boolean => {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return false;
  }

  // Check total length - UIMessage uses different structure
  const totalLength = messages.reduce((acc, msg) => {
    // UIMessage can have different content structures
    let content = "";
    if ("text" in msg && typeof msg.text === "string") {
      content = msg.text;
    } else if ("content" in msg && typeof msg.content === "string") {
      content = msg.content;
    }
    return acc + content.length;
  }, 0);

  if (totalLength > 10000) {
    // 10k character limit
    return false;
  }

  // Check for spam patterns
  const spamPatterns = [
    /http[s]?:\/\//i, // Block URLs in messages
    /viagra|casino|crypto|bitcoin/i,
    /(.)\1{10,}/i, // Repeated characters
  ];

  return !messages.some((msg) => {
    let content = "";
    if ("text" in msg && typeof msg.text === "string") {
      content = msg.text;
    } else if ("content" in msg && typeof msg.content === "string") {
      content = msg.content;
    }
    return spamPatterns.some((pattern) => pattern.test(content));
  });
};

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const referer = headersList.get("referer") || "";

    // Check referer (basic CSRF protection)
    if (!referer.includes(process.env.NEXT_PUBLIC_APP_URL || "localhost")) {
      return new Response("Forbidden - Invalid referer", { status: 403 });
    }

    // Use Arcjet for bot protection and rate limiting
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        console.log(`Rate limit exceeded: ${decision.reason}`);
        return new Response(
          "Too many requests. Please wait before sending another message.",
          {
            status: 429,
            headers: getRateLimitHeaders(decision),
          }
        );
      } else if (decision.reason.isBot()) {
        console.log(`Bot detected: ${decision.reason}`);
        return new Response("Access denied - Bot detected", { status: 403 });
      } else {
        console.log(`Request denied: ${decision.reason}`);
        return new Response("Forbidden", { status: 403 });
      }
    }

    // Parse and validate request body
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Validate messages
    if (!validateMessages(messages)) {
      return new Response("Invalid or suspicious message content", {
        status: 400,
      });
    }

    // Process the chat request
    const result = streamText({
      model: google(chatbotConfig.api.model),
      messages: convertToModelMessages(messages),
      system: chatbotConfig.api.systemPrompt,
    });

    // Return the streaming response with rate limit headers
    const response = result.toUIMessageStreamResponse();

    // Add rate limit headers to the response if available
    const rateLimitHeaders = getRateLimitHeaders(decision);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: unknown) {
    console.error("Error in chat API:", error);

    // Handle specific error types
    if (error instanceof Error && error.name === "SyntaxError") {
      return new Response("Invalid request format", { status: 400 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
