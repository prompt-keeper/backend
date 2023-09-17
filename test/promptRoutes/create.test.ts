import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "../utils";

const endpoint_url = "http://localhost/prompts";

const invalidPayloads = [
  {},
  { name: 111 },
  {
    name: "prompt 1",
  },
  {
    content: "content 1",
  },
  {
    name: "prompt 1",
    id: "pk_1",
    content: "content 1",
  },
  {
    name1: "prompt 1",
    content: "content 1",
  },
];

describe("CreatePrompt", () => {
  beforeEach(async () => {
    // create 2 sample prompts
    await createSamplePrompts();
  });
  it("should create new prompt with valid input", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          body: { name: "prompt 3", content: "content 3" },
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("content");
    expect(response).toHaveProperty("sha");
    expect(response.name).toBe("prompt 3");
    expect(response.content).toBe("content 3");
  });

  it("should return error if name is exists", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          body: {
            name: "prompt 1",
            content: "content 1",
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
