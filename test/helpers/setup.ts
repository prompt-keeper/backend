// src/tests/helpers/setup.ts

import { beforeEach } from "bun:test";
import resetDb from "./reset_db";

beforeEach(async () => {
  console.log("Resetting database");
  await resetDb();
});
