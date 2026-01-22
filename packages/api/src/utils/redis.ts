import { Redis } from 'ioredis';
import { config } from '../config/index.js';
import { logger } from './logger.js';

let redisClient: Redis | null = null;
let isConnected = false;

/**
 * Get or create the Redis client
 */
export function getRedisClient(): Redis | null {
  if (!config.redis.url) {
    logger.debug('Redis URL not configured, caching disabled');
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    const client = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy(times: number): number | null {
        if (times > 3) {
          logger.error('Redis connection failed after 3 retries');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 2000); // Exponential backoff
      },
    });

    client.on('connect', () => {
      isConnected = true;
      logger.info('Redis connected');
    });

    client.on('error', (error: Error) => {
      isConnected = false;
      logger.error('Redis error:', { error: error.message });
    });

    client.on('close', () => {
      isConnected = false;
      logger.info('Redis connection closed');
    });

    // Connect lazily
    client.connect().catch((error: Error) => {
      logger.error('Failed to connect to Redis:', { error: error.message });
    });

    redisClient = client;
    return client;
  } catch (error) {
    logger.error('Failed to create Redis client:', { error });
    return null;
  }
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return isConnected && redisClient !== null;
}

/**
 * Get a value from Redis cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client || !isConnected) return null;

  try {
    const value = await client.get(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  } catch (error) {
    logger.error('Redis get error:', { key, error });
    return null;
  }
}

/**
 * Set a value in Redis cache with optional TTL
 */
export async function cacheSet(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isConnected) return false;

  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, serialized);
    } else {
      await client.set(key, serialized);
    }
    return true;
  } catch (error) {
    logger.error('Redis set error:', { key, error });
    return false;
  }
}

/**
 * Delete a value from Redis cache
 */
export async function cacheDelete(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isConnected) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    logger.error('Redis delete error:', { key, error });
    return false;
  }
}

/**
 * Delete all keys matching a pattern
 */
export async function cacheDeletePattern(pattern: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isConnected) return false;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
    return true;
  } catch (error) {
    logger.error('Redis delete pattern error:', { pattern, error });
    return false;
  }
}

/**
 * Add a token to the blacklist (for logout)
 */
export async function blacklistToken(token: string, expiresInSeconds: number): Promise<boolean> {
  const key = `blacklist:${token}`;
  return cacheSet(key, true, expiresInSeconds);
}

/**
 * Check if a token is blacklisted
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const key = `blacklist:${token}`;
  const result = await cacheGet<boolean>(key);
  return result === true;
}

// Cache keys for different data types
export const CACHE_KEYS = {
  COUNTRIES_LIST: 'countries:list',
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  TRAVEL_RECORDS: (userId: string, start: string, end: string) => `travel:${userId}:${start}:${end}`,
} as const;

// TTL values in seconds
export const CACHE_TTL = {
  COUNTRIES_LIST: 24 * 60 * 60, // 24 hours
  USER_PROFILE: 5 * 60, // 5 minutes
  TRAVEL_RECORDS: 60, // 1 minute
} as const;

/**
 * Disconnect Redis client gracefully
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isConnected = false;
    logger.info('Redis disconnected');
  }
}
