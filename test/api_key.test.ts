import { describe, expect, it } from "bun:test";
import app from "../src/app";

describe("List api key", () => {
  it("return a list of keys", async () => {
    const response = await app
      .handle(new Request("http://localhost/api_key/list"))
      .then((res) => res.json());

    const expected = {
      keys: ["key1", "key2"],
    };
    expect(response).toStrictEqual(expected);
  });
});

describe("Create api key", () => {
  it("return a new key with type write ", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api_key/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key_type: "write" }),
        }),
      )
      .then((res) => res.json());

    const expected = {
      key: "New key created",
      key_type: "write",
    };
    expect(response).toEqual(expected);
  });

  it("return error if request with no key_type", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api_key/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }),
      )
      .then((res) => res.json());

    const expected = {
      error: "Key type is required",
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
