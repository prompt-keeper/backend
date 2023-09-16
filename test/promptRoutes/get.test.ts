import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";

const endpoint_url = "http://localhost/prompts";

describe("Get one single prompt", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });

  it("prompts: get prompt by id", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}/find`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({ id: "pk_1" }),
        }),
      )
      .then((res) => res.json());
    expect(response).toHaveProperty("name");
    expect(response.name).toBe("prompt 1");
  });

  it("prompts: get prompt by name", async () => {
    const response = await app
      .handle(
        new Request(encodeURI(`${endpoint_url}/find`), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({ name: "prompt 1" }),
        }),
      )
      .then((res) => res.json());

    expect(response).toHaveProperty("name");
    expect(response.name).toBe("prompt 1");
    expect(response.id).toBe("pk_1");
  });

  it("prompts: response error if payload is invalid", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}/find`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({
            id1: "pk_1",
          }),
        }),
      )
      .then((res) => res.json());

    const expected = {
      error: "Invalid payload",
    };
    expect(response.error).toEqual(expected.error);
  });
  it("prompts: response error if payload containd both id and name", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}/find`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({
            id: "pk_1",
            name: "prompt 1",
          }),
        }),
      )
      .then((res) => res.json());

    const expected = {
      error: "Invalid payload",
    };
    expect(response.error).toStartWith(expected.error);
  });
});
