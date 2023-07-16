import { createClient } from "redis";

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// const redisClient = createClient({
//     disableOfflineQueue: true
// });

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis() {
  await redisClient.connect();
}

export default redisClient;
