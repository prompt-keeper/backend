import { Elysia, t } from "elysia";
import { UnauthorizedError } from "../errors/null_body_error";
import { randomBytes } from "crypto";
import prisma from "../prisma";

const CreateAPIKeyDTO = t.Object({
  name: t.String({
    error: "Name is required",
  }),
  type: t.String({
    error: "Key type is required",
  }),
});

const DeleteAPIKeyDTO = t.Object({
  id: t.String({
    error: "ID is required",
  }),
});

const list_api_key = async () => {
  const keys = await prisma.apiKey.findMany();
  return {
    keys: keys.map((key) => ({
      key: key.id,
      name: key.name,
      type: key.type,
    })),
  };
};

const create_new_api_key = async ({
  name,
  type,
}: typeof CreateAPIKeyDTO.static) => {
  if (type !== "READ" && type !== "WRITE" && type !== "ADMIN") {
    throw new Error("Key type is invalid");
  }

  const apiKeyValue = `pk_${randomBytes(16).toString("hex")}`;

  const apiKey = await prisma.apiKey.create({
    data: {
      id: apiKeyValue,
      name,
      type: type,
    },
  });

  return {
    name: apiKey.name,
    key: apiKey.id,
    type: apiKey.type,
  };
};

const delete_api_key = ({ id }: typeof DeleteAPIKeyDTO.static) => {
  return {
    message: `Deleted ${id}`,
  };
};

const api_key = new Elysia({ prefix: "/api_key" })
  .onTransform(({ bearer }: any) => {
    if (!bearer) {
      throw new UnauthorizedError("Unauthorized");
    }

    // the bearer should match with the api_key in the database
    //  or the master key
    if (bearer === process.env.MASTER_KEY) {
      return;
    }

    throw new UnauthorizedError("Unauthorized");
  })
  .get("/list", list_api_key, {
    response: t.Object({
      keys: t.Array(
        t.Object({
          key: t.String(),
          name: t.String(),
          type: t.String(),
        }),
      ),
    }),
  })
  .post("/create", ({ body }) => create_new_api_key(body), {
    body: CreateAPIKeyDTO,
    response: t.Object({
      name: t.String(),
      key: t.String(),
      type: t.String(),
    }),
  })
  .delete("/delete/:id", ({ params }) => delete_api_key(params), {
    params: DeleteAPIKeyDTO,
    response: t.Object({
      message: t.String(),
    }),
  });

export default api_key;
