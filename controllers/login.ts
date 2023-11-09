import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Context, HTTPException } from 'https://deno.land/x/hono@v3.9.2/mod.ts';
import * as hono from "https://deno.land/x/hono@v3.10.0-rc.2/utils/jwt/jwt.ts";

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
  const match = await bcrypt.compare(String(password), hash);
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