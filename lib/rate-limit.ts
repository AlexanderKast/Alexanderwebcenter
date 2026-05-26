import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
};

let redis: Redis | null = null;
let formLimiterInstance: Ratelimit | null = null;
let emailLimiterInstance: Ratelimit | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function getFormLimiter(): Ratelimit | null {
  if (formLimiterInstance) return formLimiterInstance;
  const r = getRedis();
  if (!r) return null;
  formLimiterInstance = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "rl:form",
  });
  return formLimiterInstance;
}

function getEmailLimiter(): Ratelimit | null {
  if (emailLimiterInstance) return emailLimiterInstance;
  const r = getRedis();
  if (!r) return null;
  emailLimiterInstance = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "rl:email",
  });
  return emailLimiterInstance;
}

/**
 * Rate limit por IP para formularios. 5 reqs / 10 min.
 * En dev o sin Redis configurado retorna success: true.
 */
export async function formLimiter(ip: string): Promise<LimitResult> {
  const limiter = getFormLimiter();
  if (!limiter) return { success: true };
  const res = await limiter.limit(ip);
  return {
    success: res.success,
    limit: res.limit,
    remaining: res.remaining,
    reset: res.reset,
  };
}

/**
 * Rate limit por email para prevenir spam de envios. 3 reqs / 1 h.
 */
export async function emailLimiter(email: string): Promise<LimitResult> {
  const limiter = getEmailLimiter();
  if (!limiter) return { success: true };
  const res = await limiter.limit(email.toLowerCase());
  return {
    success: res.success,
    limit: res.limit,
    remaining: res.remaining,
    reset: res.reset,
  };
}
