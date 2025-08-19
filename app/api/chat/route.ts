import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful chatbot for a website of an indoor playground called Area51. They offer play centers at Underwood, Mount Gravatt, Redcliffe, and more. They have separate entry tickets based on age (astrotots 0-2 years, minirovers 3-4 years, moonwalkers 5-12 years), and price varies by venue. Each venue allows walk in bookings, but availability is limited. There are also cafes and parties that can be hosted. At the end of the response, propose concise next-step options in square brackets to create integrated buttons when needed, e.g.[View prices] [View venues]. Avoid using these repetitively (dont list each venue as a separate option).",
  });

  return result.toUIMessageStreamResponse();
}
