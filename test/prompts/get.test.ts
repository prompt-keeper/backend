import {  beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "test/utils";

const endpoint_url = "http://localhost/prompts";

const invalidPayload = [
  {},
  {
    id: "pk_1",
    name: "prompt 1",
    name1: "prompt 1",
  },
  {
    id1: "pk_1",
    id: "pk_1",
    name: "prompt 1",
  },
  {
    id1: "pk_1",
    name1: "prompt 1",
  },
  { id1: "pk_1" },
  { name1: "prompt 1" },
];

describe("GetPrompt: get one single prompt", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });

  it("get prompt by id", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/find`, {
          body: {
            id: "pk_1",
          },
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("name");
    expect(response.name).toBe("prompt1");
  });

  it("get prompt by name", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/find`, { body: { name: "prompt1" } }),
      )
      .then((res) => res.json());

    expect(response).toHaveProperty("name");
    expect(response.name).toBe("prompt1");
    expect(response.id).toBe("pk_1");
  });

  it("if payload containd both id and name, and there is a prompt match with it", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/find`, {
          body: { id: "pk_1", name: "prompt1" },
        }),
      )
      .then((res) => res.json());

    expect(response).toHaveProperty("name");
    expect(response.name).toBe("prompt1");
    expect(response.id).toBe("pk_1");
  });

  it("if payload containd both id and name, and there is no prompt match with it", async () => {
    const response = await app.handle(
      validRequest(`${endpoint_url}/find`, {
        body: { id: "pk_1", name: "prompt 2" },
      }),
    );

    const responseJson = await response.json();
    expect(responseJson).toHaveProperty("error");
    expect(responseJson.error).toBe("No prompt found");
    expect(response.status).toBe(404);
  });

  it.each(invalidPayload)(
    "response error if payload is invalid",
    async (payload) => {
      console.log("with invalid payload", payload);
      const response = await app
        .handle(validRequest(`${endpoint_url}/find`, { body: payload }))
        .then((res) => res.json());

      expect(response.error).toStartWith("Invalid body");
    },
  );

  it("get prompt should have latest version", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/find`, { body: { name: "prompt3" } }),
      )
      .then((res) => res.json());

    expect(response).toHaveProperty("content");
    expect(response.content).toBe("content 3.2");
  });
});
