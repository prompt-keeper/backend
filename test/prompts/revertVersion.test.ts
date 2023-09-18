import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "test/utils";

describe("Revert prompt version", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });

  it.each([{ id: "pk_2" }, { name: "prompt2" }])(
    "revert version with valid input",
    async (body) => {
      console.log("body: ", body);
      const response = await app
        .handle(
          validRequest(`http://localhost/prompts/revert`, {
            method: "POST",
            body,
          }),
        )
        .then((res) => res.json());
      expect(response).toHaveProperty("sha");
      expect(response.sha).toBe("sha_2.1");
      expect(response).toHaveProperty("content");
      expect(response.content).toBe("content 2.1");
    },
  );

  it("return error if prompt only has one version", async () => {
    const response = await app
      .handle(
        validRequest(`http://localhost/prompts/revert`, {
          method: "POST",
          body: { id: "pk_1" },
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("error");
    expect(response.error).toBe("Cannot revert prompt with only one version");
  });

  const invalidPayloads = [{}, { id1: "pk_1" }];
  it.each(invalidPayloads)("return error for invalid payload", async (body) => {
    console.log("Invalid payload: ", body);
    const response = await app
      .handle(
        validRequest(`http://localhost/prompts/revert`, {
          method: "POST",
          body,
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("error");
    expect(response.error).toStartWith("Invalid body");
  });
});
