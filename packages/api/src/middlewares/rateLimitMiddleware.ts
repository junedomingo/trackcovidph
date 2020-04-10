import { MiddlewareFn, NextFn } from 'type-graphql';

import { AppContext } from '../types/interfaces';
import { redis } from '../config';
import { CACHE_TTL } from '../conts';

export const rateLimit: (limit?: number) => MiddlewareFn<AppContext> = (limit = 100) => async (
  { context: { req }, info },
  next
): Promise<NextFn> => {
  const key = `rate-limit:${info.fieldName}:${req.ip}`;
  const current = await redis.incr(key);

  if (current > limit) {
    throw new Error('You have reached the limit. Please try again after 20 minutes');
  } else if (current === 1) {
    await redis.expire(key, CACHE_TTL);
  }

  return next();
};
