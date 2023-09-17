import {
  CreatePromptBody,
  CreatePromptResponse,
  UpdatePromptBody,
} from "@/dtos/promptsDTO";
import { NotFoundError, PrismaError } from "@/errors";
import prisma from "@/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import crypto from "crypto";

const listPrompt = async () => {
  const prompts = await prisma.prompt.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return { prompts };
};

const getPrompt = async (body: { id: string } | { name: string }) => {
  // body should contain either id or name and not other fields
  let found = false;
  for (const key in body) {
    if (key !== "id" && key !== "name") {
      // If any property other than "id" or "name" is found, return false
      throw new Error("Invalid payload");
    }
    found = true;
  }

  if (!found) {
    // if there is no id or name in the body
    throw new Error("Invalid payload");
  }

  const prompt = await prisma.prompt.findUnique({
    where: {
      ...body,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!prompt) {
    throw new NotFoundError("No prompt found");
  }

  return prompt;
};

const createPrompt = async (
  body: typeof CreatePromptBody.static,
): Promise<typeof CreatePromptResponse.static> => {
  try {
    const prompt = await prisma.$transaction(async (tx) => {
      // 1. create prompt
      const prompt = await tx.prompt.create({
        data: {
          name: body.name,
        },
        select: {
          id: true,
          name: true,
        },
      });

      // 2.create sha for prompt version

      // Create a new SHA-256 hash object
      const sha256 = crypto.createHash("sha256");

      const sha = sha256
        .update(
          `${JSON.stringify({ content: body.content })}-${
            prompt.id
          }-${Date.now()}`,
        )
        .digest("hex");

      // 3. create prompt version
      const version = await tx.promptVersion.create({
        data: {
          sha,
          promptId: prompt.id,
          content: body.content,
        },
        select: {
          sha: true,
          content: true,
        },
      });

      return {
        ...prompt,
        ...version,
      };
    });

    return prompt;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new PrismaError("Name already exists", e.code);
      }
    }
    throw Error("Unknown error");
  }
};

const updatePrompt = async (body: typeof UpdatePromptBody.static) => {
  // there would be 3 cases:
  // 1. update prompt name
  // 2. update prompt content
  // 3. or both name and content
  const prompt = await prisma.prompt.update({
    where: {
      id: body.id,
    },
    data: {
      ...body,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return prompt;
};

export default { listPrompt, getPrompt, createPrompt, updatePrompt };
