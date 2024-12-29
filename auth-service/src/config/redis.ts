// import { createClient } from "redis";

// import { logger } from "@envy-core/common";

// export const redisClient = createClient({
//   url: "redis://redis-svc:6379",
// });

// redisClient.on('error', (err) => {
//   console.error('Redis Client Error', err);
// });
// redisClient.connect().catch((err) => console.error('Failed to connect to Redis', err));

// (async () => {
//   try {
//     await redisClient.connect();
//     logger.info("Redis Client Connected");
//   } catch (error) {
//     logger.error("Redis connection error:");
//     console.log(error);
//   }
// })();
