import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "test/utils";

describe("GetVersion: get one single version", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });

  it("get version by id and sha", async () => {
    const response = await app
      .handle(
        validRequest(`http://localhost/prompts/findVersion`, {
          method: "POST",
          body: {
            id: "pk_1",
            sha: "sha_1",
          },
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("sha");
    expect(response.sha).toBe("sha_1");
    expect(response).toHaveProperty("content");
    expect(response.content).toBe("content 1");
  });

  it("get version by name and sha", async () => {
    const response = await app
      .handle(
        validRequest(`http://localhost/prompts/findVersion`, {
          method: "POST",
          body: {
            name: "prompt3",
            sha: "sha_3.2",
          },
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("sha");
    expect(response.sha).toBe("sha_3.2");
    expect(response).toHaveProperty("content");
    expect(response.content).toBe("content 3.2");
    expect(response).toHaveProperty("createdAt");
  });

  const invalidPayloads = [{}, { id: "pk_1" }, { name: "prompt1" }];
  it.each(invalidPayloads)(
    "return error for invalid payload",
    async (payload) => {
      console.log("Invalid payload", payload);
      const response = await app
        .handle(
          validRequest(`http://localhost/prompts/findVersion`, {
            method: "POST",
            body: payload,
          }),
        )
        .then((res) => res.json());
      expect(response).toHaveProperty("error");
      expect(response.error).toStartWith("Invalid body");
    },
  );
});
