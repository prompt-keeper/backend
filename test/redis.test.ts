import redis from "@/redis";
import { describe, expect, it} from "bun:test";

describe("redis", () => {
  it("can connect to redis", async () => {
    redis.set("foo", "bar");
    const value = await redis.get("foo");
    expect(value).toEqual("bar");
  });

  it("get non cached item", async () => {
    const value = await redis.get("would not be cached");
    expect(value).toEqual(null);
  });
});
