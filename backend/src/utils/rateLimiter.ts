import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from './logger';

class RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }>;
  private readonly windowMs: number;
  
  constructor(windowMs: number = 60000) { // Default: 1 minute window
    this.store = new Map();
    this.windowMs = windowMs;
    
    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }
  
  increment(key: string): number {
    const now = Date.now();
    const record = this.store.get(key);
    
    if (!record || now > record.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return 1;
    }
    
    record.count += 1;
    return record.count;
  }
  
  getResetTime(key: string): number {
    const record = this.store.get(key);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }
  
  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

interface RateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  standardHeaders?: boolean;
  message?: string;
}

export const createRateLimiter = (options: RateLimiterOptions = {}) => {
  const {
    windowMs = 60000,
    maxRequests = 100,
    standardHeaders = true,
    message = 'Too many requests, please try again later'
  } = options;
  
  const store = new RateLimitStore(windowMs);
  
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Get client identifier (IP address)
    const key = request.ip || 'unknown';
    
    // Increment request count
    const requestCount = store.increment(key);
    const resetTime = store.getResetTime(key);
    
    // Set headers if enabled
    if (standardHeaders) {
      reply.header('X-RateLimit-Limit', maxRequests.toString());
      reply.header('X-RateLimit-Remaining', Math.max(0, maxRequests - requestCount).toString());
      reply.header('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
    }
    
    // If over limit, send error response
    if (requestCount > maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${key}`);
      reply.status(429).send({ error: message });
      return reply;
    }
  };
};

export const setupRateLimiter = (fastify: FastifyInstance, options: RateLimiterOptions = {}): void => {
  const rateLimiter = createRateLimiter(options);
  
  // Apply rate limiter to all routes
  fastify.addHook('onRequest', rateLimiter);
  
  logger.info('Rate limiter middleware registered');
};
