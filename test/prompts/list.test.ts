import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "test/utils";

const endpoint_url = "http://localhost/prompts";

describe("GetPrompts: get list of prompts", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });

  it("return a list of prompts", async () => {
    const response = await app
      .handle(validRequest(`${endpoint_url}`, { method: "GET" }))
      .then((res) => res.json());

    expect(response.prompts).toHaveLength(3);
    for (const prompt of response.prompts) {
      expect(prompt).toHaveProperty("name");
      expect(["prompt1", "prompt2", "prompt3"]).toContain(prompt.name);
    }
  });

  it("each returned prompt should have content", async () => {
    const response = await app
      .handle(validRequest(`${endpoint_url}`, { method: "GET" }))
      .then((res) => res.json());

    expect(response.prompts).toHaveLength(3);
    // console.log(response.prompts);
    for (const prompt of response.prompts) {
      expect(prompt).toHaveProperty("name");
      expect(["prompt1", "prompt2", "prompt3"]).toContain(prompt.name);
      expect(prompt).toHaveProperty("content");
      expect(["content 1", "content 2.2", "content 3.2"]).toContain(
        prompt.content,
      );
    }
  });
});
