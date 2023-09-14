import { describe, expect, it } from "bun:test";
import app from "../src/app";
import prisma from "../src/prisma";

describe("List api key", () => {
  it("return a list of keys", async () => {
    // create 2 api keys
    await prisma.apiKey.createMany({
      data: [
        {
          id: "pk_1",
          name: "key1",
          type: "READ",
        },
        {
          id: "pk_2",
          name: "key2",
          type: "WRITE",
        },
      ],
    });

    const response = await app
      .handle(
        new Request("http://localhost/api_key/list", {
          headers: {
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
        }),
      )
      .then((res) => res.json());

    const expected = {
      keys: [
        {
          key: "pk_1",
          name: "key1",
          type: "READ",
        },
        {
          key: "pk_2",
          name: "key2",
          type: "WRITE",
        },
      ],
    };
    expect(response).toStrictEqual(expected);
  });
});

describe("Create api key", () => {
  it("return a new key with type write", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api_key/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({ type: "WRITE", name: "test" }),
        }),
      )
      .then((res) => {
        return res.json();
      });

    const expected = {
      name: "test",
      type: "WRITE",
    };
    expect(response.name).toEqual(expected.name);
    expect(response.type).toEqual(expected.type);
    expect(response.key).toMatch(/^pk_/);
  });

  it("return error if request with no key_type", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api_key/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({
            name: "test",
          }),
        }),
      )
      .then((res) => res.json());

    const expected = {
      error: "Key type is required",
    };
    expect(response).toEqual(expected);
  });

  it("return error if request with wrong key_type", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api_key/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({
            name: "test",
            type: "write",
          }),
        }),
      )
      .then((res) => res.json());

    const expected = {
      error: "Key type is invalid",
    };
    expect(response.error).toEqual(expected.error);
  });

  it("return error if request with no name", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api_key/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({
            type: "READ",
          }),
        }),
      )
      .then((res) => res.json());

    const expected = {
      error: "Name is required",
    };
    expect(response).toEqual(expected);
  });

  it("return error if request with empty body", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api_key/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
        }),
      )
      .then((res) => {
        return res;
      });

    const responseJson = await response.json();

    const expected = {
      error: "Request body is required",
    };
    expect(responseJson).toEqual(expected);
    expect(response.status).toEqual(400);
  });

  it.skip("return a new key with type read ", async () => {});
  it.skip("return error if key_type is not either `read` or `write`", async () => {});
});
