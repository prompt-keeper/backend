import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "../utils";

const endpoint_url = "http://localhost/prompts";

const invalidPayloads = [
  {},
  {
    name: 123,
  },
  {
    name: "prompt 1",
    id: "pk_1",
  },
  {
    name1: "prompt 1",
  },
];

describe("CreatePrompt", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });
  it("should create new prompt with valid input", async () => {
    const response = await app
      .handle(validRequest(`${endpoint_url}/`, { body: { name: "prompt 3" } }))
      .then((res) => res.json());
    expect(response).toHaveProperty("id");
    expect(response.name).toBe("prompt 3");
  });

  it("should return error if name is exists", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          body: {
            name: "prompt 1",
          },
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("error");
    expect(response.error).toBe("Name already exists");
  });

  it.each(invalidPayloads)(
    "should return error with invalid payload",
    async (payload) => {
      console.log("Payload: ", payload);
      const response = await app
        .handle(validRequest(`${endpoint_url}/`, { body: payload }))
        .then((res) => res.json());
      expect(response).toHaveProperty("error");
      expect(response.error).toStartWith("Invalid body");
    },
  );
});
