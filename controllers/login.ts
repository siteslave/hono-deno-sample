import * as argon2 from "https://deno.land/x/argon2/mod.ts";
import { Context, HTTPException } from 'jsr:@hono/hono@4.8.12';
import * as hono from "jsr:@hono/hono@4.8.12/jwt";

import { LoginModel } from '../models/login.ts';
import { SECRET_KEY } from '../config.ts';

export const login = async (c: Context) => {
  const model = new LoginModel()

  const { username, password } = await c.req.parseBody()

  const user = await model.loginInfo(username);

  if (!user) {
    throw new HTTPException(404, { message: 'User not found.' })
  }

  const hash = user[0].password
  const match = await argon2.verify(hash, String(password));
  if (!match) {
    c.status(401)
    return c.json({ ok: false, message: 'Invalid password' })
  }

  const payload = {
    sub: user[0].user_id,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
  }

  const secret = SECRET_KEY
  const token = await hono.sign(payload, secret)

  return c.json({
    ok: true,
    token,
  })
}