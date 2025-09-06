import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

// Arcjet configuration for chat API protection
export const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    shield({ mode: "LIVE" }),

    // Bot detection - blocks all detected bots
    detectBot({
      mode: "LIVE",
      allow: [],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 2, // Refill 2 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

// Helper function to get rate limit headers from Arcjet decision
export const getRateLimitHeaders = (decision: {
  reason?: {
    isRateLimit: () => boolean;
    limit?: number;
    remaining?: number;
    reset?: number;
    retryAfter?: number;
  };
}) => {
  const headers: Record<string, string> = {};

  if (decision.reason?.isRateLimit()) {
    const rateLimit = decision.reason;
    headers["X-RateLimit-Limit"] = rateLimit.limit?.toString() || "0";
    headers["X-RateLimit-Remaining"] = rateLimit.remaining?.toString() || "0";
    headers["X-RateLimit-Reset"] = rateLimit.reset
      ? new Date(rateLimit.reset).toISOString()
      : "";
    if (rateLimit.retryAfter) {
      headers["Retry-After"] = rateLimit.retryAfter.toString();
    }
  }

  return headers;
};
