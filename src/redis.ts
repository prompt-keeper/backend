import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.log("Redis Client Error", err));
redis.on("ready", () => console.log("Redis is ready"));

await redis.connect();

// Helper function to get data from cache
const getCache = async (key: string) => {
  try {
    const cachedResult = await redis.get(key);
    if (!cachedResult) return null;
    return JSON.parse(cachedResult);
  } catch (e) {
    console.log("redis error", e);
  }
  return null;
};

const setCache = async (key: string, value: any) => {
  try {
    await redis.set(key, JSON.stringify(value), { EX: 60 });
  } catch (e) {
    console.log("Cannnot set redis");
    console.log("redis error", e);
  }
};

const deleteCache = async (key: string) => {
  try {
    await redis.del(key);
  } catch (e) {
    console.log("Cannnot delete redis");
    console.log("redis error", e);
  }
};

export default redis;
export { getCache, setCache, deleteCache };
