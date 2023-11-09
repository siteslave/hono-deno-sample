import postgres from "https://deno.land/x/postgresjs@v3.4.3/mod.js"
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from '../config.ts'

const sql = postgres({
  host: DB_HOST || 'localhost',
  port: DB_PORT || 5432,
  database: DB_NAME || 'test',
  username: DB_USER || 'postgres',
  password: DB_PASSWORD || '',
})

export default sql