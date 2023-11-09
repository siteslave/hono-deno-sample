import { Context, HTTPException, Hono } from 'https://deno.land/x/hono@v3.9.2/mod.ts'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { jwt } from "https://deno.land/x/hono@v3.10.0-rc.2/middleware.ts"

import { createUser, getUsers, removeUser, updateUser } from './controllers/users.ts'
import { login } from './controllers/login.ts'
import { SECRET_KEY } from './config.ts';

const app = new Hono()

app.onError((err, c: Context) => {
  console.log(err);
  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  throw new HTTPException(401, { message: 'Unauthorized' })
})

app.post('/gen-password', async (c: Context) => {
  const { password } = await c.req.parseBody()

  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(String(password), salt);

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

app.post('/login', login)

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
