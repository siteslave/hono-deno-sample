import { createClient } from "npm:redis@^4.5";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "../config.ts";

const redis = await createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    }
}).on('error', err => console.log('Redis Client Error', err))
.connect();

export default redis;
