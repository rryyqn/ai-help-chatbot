// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limits for different tiers
export const chatRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(8, "30 s"), // 8 requests per 30s
  analytics: true,
});

export const strictRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "30 s"), // 3 requests per 30s for suspicious users
});
