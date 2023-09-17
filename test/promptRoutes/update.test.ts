import { beforeEach, describe, expect, it } from "bun:test";
import app from "@/app";
import createSamplePrompts from "./createSamplePrompts";
import { validRequest } from "../utils";
import prisma from "@/prisma";

const endpoint_url = "http://localhost/prompts";

describe("UpdatePrompt", () => {
  beforeEach(async () => {
    // create 3 sample prompts
    await createSamplePrompts();
  });

  it("should update prompt with valid input, a new version will be created", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          method: "PUT",
          body: {
            name: "prompt1",
            content: "Updated Content",
          },
        }),
      )
      .then((res) => {
        // console.log(res);
        return res.json();
      });

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("content");
    expect(response).toHaveProperty("sha");

    // prompt1 has 2 versions
    const versions = await prisma.promptVersion.findMany({
      where: {
        promptId: "pk_1",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(versions.length).toBe(2);
    expect(versions[0]).toHaveProperty("content", "Updated Content");
  });

  it("should update prompt name with valid input", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          method: "PUT",
          body: {
            id: "pk_1",
            name: "Updated Name",
          },
        }),
      )
      .then((res) => res.json());

    console.log(response);

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name", "Updated Name");
    expect(response).not.toHaveProperty("content"); // Content should not be updated
    // prompt1 has 1 versions
    const versions = await prisma.promptVersion.findMany({
      where: {
        promptId: "pk_1",
      },
    });

    expect(versions.length).toBe(1);
  });

  it("should update prompt content with valid input", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          method: "PUT",
          body: {
            id: "pk_1",
            content: "Updated Content",
          },
        }),
      )
      .then((res) => res.json());

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("content", "Updated Content");
    expect(response).toHaveProperty("name", "prompt1");
    expect(response).toHaveProperty("sha");
    // prompt1 has 2 versions
    const versions = await prisma.promptVersion.findMany({
      where: {
        promptId: "pk_1",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(versions.length).toBe(2);
    expect(versions[0]).toHaveProperty("content", "Updated Content");
  });

  it("should update both prompt name and create a new version with valid input", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          method: "PUT",
          body: {
            id: "pk_1",
            name: "Updated Name",
            content: "New Content",
          },
        }),
      )
      .then((res) => res.json());
    console.log(response);
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name", "Updated Name");
    expect(response).toHaveProperty("content", "New Content");
    expect(response).toHaveProperty("sha");

    // prompt1 has 2 versions
    const versions = await prisma.promptVersion.findMany({
      where: {
        promptId: "pk_1",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(versions.length).toBe(2);
    expect(versions[0]).toHaveProperty("content", "New Content");
  });

  it("should create prompt version given name and content", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          method: "PUT",
          body: {
            name: "prompt1",
            content: "Updated Content",
          },
        }),
      )
      .then((res) => res.json());

    expect(response).toHaveProperty("id", "pk_1");
    expect(response).toHaveProperty("content", "Updated Content");
    expect(response).toHaveProperty("name", "prompt1");
  });

  it("should throw an error for a prompt not found", async () => {
    const response = await app
      .handle(
        validRequest(`${endpoint_url}/`, {
          method: "PUT",
          body: {
            id: "1000", // Assuming a non-existent ID
            name: "Updated Name",
          },
        }),
      )
      .then((res) => res.json());

    expect(response).toHaveProperty("error", "No prompt found");
  });

  const invalidPayloads = [
    {},
    { id: "pk_1" },
    { name: "prompt1" },
    { content: "Updated Content" },
    { id1: "pk_1", name: "prompt1" },
  ];

  it.each(invalidPayloads)(
    "should return error with invalid payload",
    async (payload) => {
      console.log("Invalid Payload: ", payload);
      const response = await app
        .handle(
          validRequest(`${endpoint_url}/`, {
            method: "PUT",
            body: payload,
          }),
        )
        .then((res) => res.json());
      expect(response).toHaveProperty("error");
      expect(response.error).toStartWith("Invalid body");
    },
  );
});
