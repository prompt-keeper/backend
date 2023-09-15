import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import app from "../src/app";

// TODO: only WRITE or ADMIN key can create a new key

describe("Elysia", () => {
  it("return a response", async () => {
    const response = await app
      .handle(new Request("http://localhost/"))
      .then((res) => res.text());

    expect(response).toBe("Hello Elysia");
  });
});

describe("Authentication system", () => {
  beforeAll(async () => {
    // Initialize Prisma for testing (e.g., set up test database)
    // Create test data
  });
  afterAll(async () => {
    // Clean up Prisma (e.g., delete test database)
  });

  it("all of protected API request must have a token", async () => {
    const response = await app
      .handle(new Request("http://localhost/api-keys"))
      .then((res) => res.json());
    expect(response).toEqual({
      error: "Unauthorized",
    });
  });

  it("masterkey should access to protected endpoint", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api-keys", {
          headers: {
            Authorization: "Bearer " + process.env.MASTER_KEY,
          },
        }),
      )
      .then((res) => res.json());
    expect(response).not.toEqual({
      error: "Unauthorized",
    });
  });

  it("return unauthorized if access with wrong token", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api-keys", {
          headers: {
            Authorization: "Bearer " + "wrong token",
          },
        }),
      )
      .then((res) => res.json());
    expect(response).toEqual({
      error: "Unauthorized",
    });
  });
});
