import { createClient } from "redis";

// const redisClient = createClient({
//     password: 'h0yBrrOOCpZa7FqyYVglGhrpN00oeu8z',
//     socket: {
//         host: 'redis-19278.c57.us-east-1-4.ec2.cloud.redislabs.com',
//         port: 19278,
//     },
// });

const redisClient = createClient({
    disableOfflineQueue: true
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export async function connectRedis() {
    await redisClient.connect();
}

export default redisClient;
