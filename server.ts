import { Context, HTTPException, Hono } from 'jsr:@hono/hono@4.8.12'
import * as argon2 from "https://deno.land/x/argon2/mod.ts";
import { jwt } from 'jsr:@hono/hono@4.8.12/jwt'

import { createUser, getUsers, removeUser, updateUser } from './controllers/users.ts'
import { login } from './controllers/login.ts'
import { SECRET_KEY } from './config.ts'
import { rateLimiter } from './middlewares/rate-limiter.ts'

const app = new Hono()

app.onError((err, c: Context) => {
  console.log(err);
  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  throw new HTTPException(500, { message: err.message })
})

app.post('/gen-password', async (c: Context) => {
  const { password } = await c.req.parseBody()

  const hash = await argon2.hash(String(password));

  return c.json({
    ok: true,
    hash,
  })
})

app.get('/', (c: Context) => {
  return c.json({
    ok: true,
    message: 'Hello world!'
  })
})

app.post('/login', rateLimiter, login)

app.use(
  '/api/*',
  jwt({
    secret: SECRET_KEY,
  })
)

app.get('/api/users', getUsers)
app.post('/api/users', createUser)
app.delete('/api/users/:id', removeUser)
app.put('/api/users/:id', updateUser)

Deno.serve({ port: 8000 }, app.fetch)
