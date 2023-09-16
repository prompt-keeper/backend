import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";

const endpoint_url = "http://localhost/prompts";

describe("Get list of prompts", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });

  it("prompts: return a list of prompts", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}`, {
          headers: {
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
        }),
      )
      .then((res) => res.json());

    expect(response.prompts).toHaveLength(3);
    for (const prompt of response.prompts) {
      expect(prompt).toHaveProperty("name");
      expect(["prompt 1", "prompt2", "prompt3"]).toContain(prompt.name);
    }
  });
});
