// src/tests/helpers/setup.ts

import { afterEach, beforeEach } from "bun:test";
import resetDb from "./resetDb";
import redis from "@/redis";

beforeEach(async () => {
  console.log("Resetting database");
  await resetDb();

  try {
    await redis.connect();
  } catch (err) {
    // console.log(err);
    console.log("Redis is already connected");
  }
  await redis.flushDb();
});

afterEach(async () => {
  await redis.disconnect();
});
