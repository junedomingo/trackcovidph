import { RedisCache } from 'apollo-server-cache-redis';

export const redis = new RedisCache({
  port: 6379,
  host: 'localhost',
});
