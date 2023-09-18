import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "test/utils";

describe("Delete prompt", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });

  it.each([{ id: "pk_2" }, { name: "prompt2" }])(
    "delete prompt with valid input",
    async (body) => {
      console.log("body: ", body);
      const response = await app
        .handle(
          validRequest(`http://localhost/prompts/delete`, {
            method: "POST",
            body,
          }),
        )
        .then((res) => res.json());
      expect(response).toHaveProperty("status");
      expect(response.status).toBe("success");
    },
  );

  it.each([{ id: "pk_4" }, { name: "prompt4" }])(
    "delete prompt with valid input but prompt does not exist",
    async (body) => {
      console.log("body: ", body);
      const response = await app
        .handle(
          validRequest(`http://localhost/prompts/delete`, {
            method: "POST",
            body,
          }),
        )
        .then((res) => res.json());
      console.log("response: ", response);
      expect(response).toHaveProperty("error");
      expect(response.error).toBe("Prompt does not exist");
    },
  );

  const invalidPayloads = [{}, { id1: "pk_1" }];
  it.each(invalidPayloads)("return error for invalid payload", async (body) => {
    console.log("Invalid payload: ", body);
    const response = await app
      .handle(
        validRequest(`http://localhost/prompts/delete`, {
          method: "POST",
          body,
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("error");
    expect(response.error).toStartWith("Invalid body");
  });
});
