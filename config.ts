import { load } from "https://deno.land/std@0.205.0/dotenv/mod.ts";

const env = await load();

export const DB_HOST = env["DB_HOST"] || '127.0.0.1';
export const DB_PORT = env["DB_PORT"] || 5432;
export const DB_NAME = env["DB_NAME"] || 'test';
export const DB_USER = env["DB_USER"] || 'postgres';
export const DB_PASSWORD = env["DB_PASSWORD"] || '123456';
export const SECRET_KEY = env["SECRET_KEY"] || 'tdsKytaxRN5P18td';