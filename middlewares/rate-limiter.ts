import { Context, Next } from 'jsr:@hono/hono@4.8.12';
import { HTTPException } from 'jsr:@hono/hono@4.8.12/http-exception';
import redis from '../db/redis.ts';

const RATE_LIMIT_TTL = 60; // 1 minute
const RATE_LIMIT_ATTEMPTS = 5;

export const rateLimiter = async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || '127.0.0.1';

    const current = await redis.get(ip);
    if (current && Number(current) > RATE_LIMIT_ATTEMPTS) {
        throw new HTTPException(429, { message: 'Too many requests' });
    }

    const multi = redis.multi();
    multi.incr(ip);
    multi.expire(ip, RATE_LIMIT_TTL);
    await multi.exec();

    await next();
}
