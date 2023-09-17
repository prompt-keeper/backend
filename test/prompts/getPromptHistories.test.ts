import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "test/utils";

const endpoint_url = "http://localhost/prompts";

describe("Get prompt histories", () => {
  beforeEach(async () => {
    await createSamplePrompts();
  });
  it.each([
    { body: { id: "pk_1" }, histories: 1 },
    { body: { id: "pk_2" }, histories: 3 },
    { body: { id: "pk_3" }, histories: 2 },
  ])("return a list of prompt histories by prompt id", async (fixture) => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/log`, {
          method: "POST",
          body: fixture.body,
        }),
      )
      .then((res) => {
        // console.log(res);
        return res.json();
      });
    // console.log(response);
    expect(response.histories).toHaveLength(fixture.histories);
    for (const history of response.histories) {
      expect(history).toHaveProperty("content");
      expect(history).toHaveProperty("sha");
      expect(history).toHaveProperty("createdAt");
    }
  });

  it.each([
    { body: { name: "prompt1" }, histories: 1 },
    { body: { name: "prompt2" }, histories: 3 },
    { body: { name: "prompt3" }, histories: 2 },
  ])("return a list of prompt histories by prompt name", async (fixture) => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/log`, {
          method: "POST",
          body: fixture.body,
        }),
      )
      .then((res) => {
        // console.log(res);
        return res.json();
      });
    // console.log(response);
    expect(response.histories).toHaveLength(fixture.histories);
    for (const history of response.histories) {
      expect(history).toHaveProperty("content");
      expect(history).toHaveProperty("sha");
      expect(history).toHaveProperty("createdAt");
    }
  });
  it.each([
    { body: { name: "prompt1", number: 1 }, histories: 1 },
    { body: { name: "prompt2", number: 1 }, histories: 1 },
    { body: { name: "prompt3", number: 1 }, histories: 1 },
  ])(
    "return a list of prompt histories by prompt name and number",
    async (fixture) => {
      const response = await app
        .handle(
          validRequest(`${endpoint_url}/log`, {
            method: "POST",
            body: fixture.body,
          }),
        )
        .then((res) => {
          // console.log(res);
          return res.json();
        });
      // console.log(response);
      expect(response.histories).toHaveLength(fixture.histories);
      for (const history of response.histories) {
        expect(history).toHaveProperty("content");
        expect(history).toHaveProperty("sha");
        expect(history).toHaveProperty("createdAt");
      }
    },
  );

  it.each([
    { body: { name: "prompt1", number: -1 }, histories: 1 },
    { body: { name: "prompt2", number: -1 }, histories: 3 },
    { body: { name: "prompt3", number: -1 }, histories: 2 },
  ])(
    "return all prompt histories by prompt name and number of -1",
    async (fixture) => {
      const response = await app
        .handle(
          validRequest(`${endpoint_url}/log`, {
            method: "POST",
            body: fixture.body,
          }),
        )
        .then((res) => {
          // console.log(res);
          return res.json();
        });
      // console.log(response);
      expect(response.histories).toHaveLength(fixture.histories);
      for (const history of response.histories) {
        expect(history).toHaveProperty("content");
        expect(history).toHaveProperty("sha");
        expect(history).toHaveProperty("createdAt");
      }
    },
  );

  it("return empty list if prompt not found", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/log`, {
          method: "POST",
          body: { name: "prompt4" },
        }),
      )
      .then((res) => {
        return res.json();
      });
    expect(response.histories).toHaveLength(0);
  });

  it.each([
    {},
    {
      name1: "prompt1",
    },
  ])("return error if payload is invalid", async (invalidBody) => {
    console.log("with invalid payload", invalidBody);
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/log`, {
          method: "POST",
          body: invalidBody,
        }),
      )
      .then((res) => {
        // console.log(res);
        return res.json();
      });
    // console.log(response);
    expect(response).toHaveProperty("error");
    expect(response.error).toStartWith("Invalid body");
  });
});
