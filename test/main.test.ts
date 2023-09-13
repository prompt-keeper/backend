import { describe, expect, it } from "bun:test";
import app from "../src/app";

describe("Elysia", () => {
  it("return a response", async () => {
    const response = await app
      .handle(new Request("http://localhost/"))
      .then((res) => res.text());

    expect(response).toBe("Hello Elysia");
  });
});

describe("prompt keeper app", () => {
  it("all of protected API request must have a token", async () => {
    const response = await app
      .handle(new Request("http://localhost/api_key/list"))
      .then((res) => res.json());
    expect(response).toEqual({
      error: "Unauthorized",
    });
  });

  it("masterkey should access to protected endpoint", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api_key/list", {
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
});
