import { PrismaError, InvalidPayloadError } from "../errors";
import { randomBytes } from "crypto";
import prisma from "../prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateAPIKeyBody, DeleteAPIKeyParams } from "../dtos/apiKeysDTO";

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
}: typeof CreateAPIKeyBody.static) => {
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

const delete_api_key = async ({ id }: typeof DeleteAPIKeyParams.static) => {
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

export default { list_api_key, create_new_api_key, delete_api_key };
