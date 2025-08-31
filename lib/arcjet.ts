import arcjet, {
  detectBot,
  shield,
  slidingWindow,
  tokenBucket,
} from "@arcjet/next";

// Arcjet configuration for chat API protection
export const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),

    // Bot detection - block all bots except search engines
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Allow search engine bots but block others
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories if needed
        // "CATEGORY:MONITOR", // Uptime monitoring services
        // "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),

    // Sliding window rate limiting for chat requests
    slidingWindow({
      mode: "LIVE",
      // Tracked by IP address by default
      characteristics: ["ip.src"],
      interval: "30s", // counts requests over a 30 second sliding window
      max: 8, // allows 8 requests within the window (same as current)
    }),

    // Token bucket for more sophisticated rate limiting
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
