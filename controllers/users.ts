import { Context } from "https://deno.land/x/hono@v3.9.2/mod.ts"
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

import { UserModel } from "../models/user.ts"

const model = new UserModel()

export const getUsers = async (c: Context) => {
  const users = await model.getAll()
  return c.json({
    ok: true,
    users,
  })
}

export const removeUser = async (c: Context) => {
  const userId = c.req.param('id');
  await model.remove(userId)
  return c.json({
    ok: true,
  })
}

export const createUser = async (c: Context) => {

  try {

    const schema = z.object({
      username: z.string(),
      password: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })

    const body = await c.req.parseBody()

    const valid = schema.safeParse(body)

    if (!valid.success) {
      c.status(400)
      return c.json({ ok: false, message: 'Invalid data' })
    }

    const salt = await bcrypt.genSalt(8)
    const hash = await bcrypt.hash(String(body.password), salt)
    await model.createUser(body.username, hash, body.firstName, body.lastName)

    c.status(201)
    return c.json({ ok: true })

  } catch (error) {
    console.log(error)
    c.status(500)
    return c.json({ ok: false, message: 'Internal error' })
  }
}

export const updateUser = async (c: Context) => {

  try {

    const schema = z.object({
      password: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })

    const body = await c.req.parseBody()
    const userId = c.req.param('id')

    const valid = schema.safeParse(body)

    if (!valid.success) {
      c.status(400)
      return c.json({ ok: false, message: 'Invalid data' })
    }

    const salt = await bcrypt.genSalt(8)
    const hash = await bcrypt.hash(String(body.password), salt)
    await model.updateUser(userId, hash, body.firstName, body.lastName)

    c.status(200)
    return c.json({ ok: true })

  } catch (error) {
    console.log(error)
    c.status(500)
    return c.json({ ok: false, message: 'Internal error' })
  }
}