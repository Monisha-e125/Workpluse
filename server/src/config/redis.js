const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;
let isRedisConnected = false;

const connectRedis = async () => {
  try {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
      retryStrategy: (times) => {
        if (times > 3) {
          logger.warn('Redis: Max retry attempts reached');
          return null; // Stop retrying
        }
        const delay = Math.min(times * 200, 2000);
        return delay;
      }
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      logger.info('✅ Redis connected');
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      logger.error(`Redis error: ${err.message}`);
    });

    redisClient.on('close', () => {
      isRedisConnected = false;
      logger.warn('Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    // Test connection
    await redisClient.ping();

    return redisClient;
  } catch (error) {
    isRedisConnected = false;
    logger.warn(`⚠️ Redis connection failed: ${error.message}`);
    throw error;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const isRedisAvailable = () => {
  return isRedisConnected && redisClient !== null;
};

const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isRedisConnected = false;
    logger.info('Redis disconnected');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisAvailable,
  disconnectRedis
};