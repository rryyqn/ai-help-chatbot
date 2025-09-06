import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { chatbotConfig } from "./config";

// Arcjet configuration for chat API protection
export const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    // Shield protection (configurable)
    ...(chatbotConfig.security.enableShield ? [shield({ mode: "LIVE" })] : []),

    // Bot detection (configurable)
    ...(chatbotConfig.security.enableBotDetection
      ? [
          detectBot({
            mode: "LIVE",
            allow: [...chatbotConfig.security.allowedBots],
          }),
        ]
      : []),

    // Token bucket rate limiting (configurable)
    tokenBucket({
      mode: "LIVE",
      refillRate: chatbotConfig.rateLimit.refillRate,
      interval: chatbotConfig.rateLimit.interval,
      capacity: chatbotConfig.rateLimit.capacity,
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
