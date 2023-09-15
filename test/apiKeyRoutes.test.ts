import { beforeEach, describe, expect, it } from "bun:test";
import app from "../src/app";
import prisma from "../src/prisma";

const endpoint_url = "http://localhost/api-keys";

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
        new Request(`${endpoint_url}`, {
          headers: {
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
        }),
      )
      .then((res) => res.json());

    const expected = {
      keys: [
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
    };
    expect(response).toStrictEqual(expected);
  });
});

describe("Create api key", () => {
  it("return a new key with type write", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}`, {
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
    expect(response.id).toMatch(/^pk_/);
  });

  it("return error if request with no key_type", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}`, {
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
        new Request(`${endpoint_url}`, {
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
        new Request(`${endpoint_url}`, {
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
        new Request(`${endpoint_url}`, {
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

  it("return error if key_type is not either `read` or `write`", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
          body: JSON.stringify({
            type: "READING",
            name: "test",
          }),
        }),
      )
      .then((res) => {
        return res;
      });

    const responseJson = await response.json();

    const expected = {
      error: "Key type is invalid",
    };

    expect(responseJson).toEqual(expected);
    expect(response.status).toEqual(400);
  });
  // it.skip("return a new key with type read ", async () => {});
});

describe("Delete api key", () => {
  beforeEach(async () => {
    console.log("Create sample keys");
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
  });
  it("Delete a key with existing id", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}/pk_1`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MASTER_KEY}`,
          },
        }),
      )
      .then((res) => {
        return res.json();
      });

    const expected = {
      message: "Deleted pk_1",
    };
    expect(response).toEqual(expected);

    const keys = await prisma.apiKey.findMany();
    expect(keys.length).toEqual(1);
  });

  it("return error if key_id is not found", async () => {
    const response = await app
      .handle(
        new Request(`${endpoint_url}/pk_3`, {
          method: "DELETE",
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
      error: "Key not found",
    };
    expect(responseJson.error).toEqual(expected.error);
    expect(response.status).toEqual(404);
  });
});
