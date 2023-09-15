import { Elysia, t } from "elysia";
import { PrismaError, UnauthorizedError, InvalidPayloadError } from "../errors";
import { randomBytes } from "crypto";
import prisma from "../prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
    error: "key is required",
  }),
});

const list_api_key = async () => {
  const keys = await prisma.apiKey.findMany({
    select: {
      id: true,
      name: true,

      type: true,
    },
  });
  return { keys };
};

const create_new_api_key = async ({
  name,
  type,
}: typeof CreateAPIKeyDTO.static) => {
  if (type !== "READ" && type !== "WRITE" && type !== "ADMIN") {
    throw new InvalidPayloadError("Key type is invalid");
  }

  const apiKeyValue = `pk_${randomBytes(16).toString("hex")}`;

  const apiKey = await prisma.apiKey.create({
    data: {
      id: apiKeyValue,
      name,
      type: type,
    },
    select: {
      id: true,
      name: true,
      type: true,
    },
  });

  return apiKey;
};

const delete_api_key = async ({ id }: typeof DeleteAPIKeyDTO.static) => {
  try {
    await prisma.apiKey.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new PrismaError("Key not found", error.code);
      }
      throw new PrismaError(error.message, error.code);
    }
    // TODO: log error
    throw Error("Internal server error");
  }

  return {
    message: `Deleted ${id}`,
  };
};

const api_key = new Elysia({ prefix: "/api_keys" })
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
          id: t.String(),
          name: t.String(),
          type: t.String(),
        }),
      ),
    }),
  })
  .post("/create", ({ body }) => create_new_api_key(body), {
    body: CreateAPIKeyDTO,
    response: t.Object({
      id: t.String(),
      name: t.String(),
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
