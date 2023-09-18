import crypto from "crypto";
import {
  CreatePromptBody,
  CreatePromptResponse,
  DeletePromptBody,
  DeletePromptResponse,
  FindPromptBody,
  FindPromptResponse,
  FindVersionBody,
  FindVersionResponse,
  LogPromptBody,
  LogPromptResponse,
  RevertVersionBody,
  RevertVersionResponse,
  UpdatePromptBody,
  UpdatePromptResponse,
} from "@/dtos/promptsDTO";
import { NotFoundError, PrismaError } from "@/errors";
import prisma from "@/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getCache, setCache, deleteCache } from "@/redis";

const createSHA256Hash = ({ id, content }: { id: string; content: string }) => {
  const sha256 = crypto.createHash("sha256");

  const sha = sha256
    .update(`${JSON.stringify({ content })}-${id}-${Date.now()}`)
    .digest("hex");
  return sha;
};

const listPrompt = async () => {
  const prompts = await prisma.prompt.findMany({
    select: {
      id: true,
      name: true,
      versions: {
        select: {
          sha: true,
          content: true,
        },
        orderBy: {
          createdAt: "desc", // Order by createdAt in descending order to get the latest version
        },
        take: 1,
      },
    },
  });
  const results = prompts.map((prompt) => ({
    id: prompt.id,
    name: prompt.name,
    ...(prompt.versions.length > 0
      ? {
          content: prompt.versions[0].content,
          sha: prompt.versions[0].sha,
        }
      : {}),
  }));

  return { prompts: results };
};

const getPrompt = async (
  body: typeof FindPromptBody.static,
): Promise<typeof FindPromptResponse.static> => {
  // body should contain either id or name and not other fields
  if (!body.id && !body.name) {
    // if there is no id or name in the body
    throw new Error("Invalid body");
  }

  const query = {
    id: body.id,
    name: body.name,
  };

  const key =
    body.id && body.name ? `${body.id}-${body.name}` : query.id || query.name;

  const cachedResult = await getCache(key || "");
  if (cachedResult) {
    return cachedResult;
  }

  const prompt = await prisma.prompt.findUnique({
    where: query,

    select: {
      id: true,
      name: true,
      versions: {
        select: {
          sha: true,
          content: true,
        },
        orderBy: {
          createdAt: "desc", // Order by createdAt in descending order to get the latest version
        },
        take: 1,
      },
    },
  });

  if (!prompt) {
    throw new NotFoundError("No prompt found");
  }

  const result = {
    id: prompt.id,
    name: prompt.name,
    ...(prompt.versions.length > 0
      ? {
          content: prompt.versions[0].content,
          sha: prompt.versions[0].sha,
        }
      : {}),
  };

  await setCache(key || "", result);

  return result;
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
      const sha = createSHA256Hash({ id: prompt.id, content: body.content });
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

// Function to update the prompt name and return the updated record
const updatePromptName = async (
  tx: any,
  id: string,
  name: string,
): Promise<{ id: string; name: string }> => {
  return tx.prompt.update({
    where: { id },
    data: { name },
    select: { id: true, name: true },
  });
};

// Function to create a new prompt version and return its details
const createPromptVersion = async (
  tx: any,
  id: string,
  content: string,
): Promise<{ sha: string; content: string }> => {
  const sha = createSHA256Hash({ id, content });
  return tx.promptVersion.create({
    data: {
      sha,
      promptId: id,
      content,
    },
    select: {
      sha: true,
      content: true,
    },
  });
};

// Function to update the prompt name and create a new version if content is provided
const updateNameAndCreateVersion = async (
  id: string,
  name: string,
  content: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const updatedPrompt = await updatePromptName(tx, id, name);
    const version = await createPromptVersion(tx, id, content);
    return {
      ...updatedPrompt,
      ...version,
    };
  });
};

// Main function to update the prompt based on the provided body
const updatePrompt = async (
  body: typeof UpdatePromptBody.static,
): Promise<typeof UpdatePromptResponse.static> => {
  if (!body.id && (!body.name || !body.content)) {
    throw new Error("Invalid body");
  }

  const condition = body.id ? { id: body.id } : { name: body.name };
  const p = await prisma.prompt.findUnique({
    where: condition,
    select: { id: true, name: true },
  });

  if (!p) {
    throw new NotFoundError("No prompt found");
  }

  if (body.content) {
    if (body.id && body.name) {
      const updatedPrompt = await updateNameAndCreateVersion(
        p.id,
        body.name,
        body.content,
      );
      return updatedPrompt;
    }

    // Update prompt version if content is provided and either id or name is provided
    const version = await createPromptVersion(prisma, p.id, body.content);

    // delete cache
    await deleteCache(`${p.id}-${p.name}`);
    await deleteCache(`${p.id}`);
    await deleteCache(`${p.name}`);

    return {
      ...p,
      ...version,
    };
  }

  if (!body.name) {
    throw new Error("Invalid body");
  }
  // Update prompt name if no content is provided
  const updatedPrompt = await updatePromptName(prisma, p.id, body.name);
  // delete cache
  await deleteCache(`${p.id}-${p.name}`);
  await deleteCache(`${p.id}`);
  await deleteCache(`${p.name}`);

  return updatedPrompt;
};

const getPromptHistories = async ({
  id,
  name,
  number,
}: typeof LogPromptBody.static): Promise<typeof LogPromptResponse.static> => {
  if (!id && !name) {
    throw new Error("Invalid body");
  }

  const condition: { promptId?: string; prompt?: { name: string } } = {};
  if (id) {
    condition.promptId = id;
  }
  if (name) {
    condition.prompt = { name };
  }

  const n = number === -1 ? undefined : number || 5;
  const versions = await prisma.promptVersion.findMany({
    where: condition,
    orderBy: {
      createdAt: "desc",
    },
    take: n,
    select: {
      sha: true,
      content: true,
      createdAt: true,
    },
  });

  return { histories: versions };
};

const getPromptVersion = async ({
  id,
  name,
  sha,
}: typeof FindVersionBody.static): Promise<
  typeof FindVersionResponse.static
> => {
  if ((!id && !name) || !sha) {
    throw new Error("Invalid body");
  }

  const condition: {
    promptId?: string;
    prompt?: { name: string };
    sha: string;
  } = { sha };
  if (id) {
    condition.promptId = id;
  }
  if (name) {
    condition.prompt = { name };
  }

  const version = await prisma.promptVersion.findUnique({
    where: condition,
    select: {
      sha: true,
      content: true,
      createdAt: true,
    },
  });

  if (!version) {
    throw new NotFoundError("No prompt found");
  }

  return version;
};

const revertPromptVersion = async ({
  id,
  name,
}: typeof RevertVersionBody.static): Promise<
  typeof RevertVersionResponse.static
> => {
  // prompt only has one version, return error
  // else delete the latest version and return the previous version

  if (!id && !name) {
    // if there is no id or name in the body
    throw new Error("Invalid body");
  }

  const condition = {
    id,
    name,
  };

  const prompt = await prisma.prompt.findUnique({
    where: condition,
    select: {
      id: true,
      name: true,
      versions: {
        select: {
          sha: true,
          content: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 2,
      },
    },
  });

  if (!prompt) {
    throw new NotFoundError("No prompt found");
  }

  if (prompt.versions.length === 1) {
    throw new Error("Cannot revert prompt with only one version");
  }

  const [latestVersion, previousVersion] = prompt.versions;

  await prisma.promptVersion.delete({
    where: {
      sha: latestVersion.sha,
    },
  });

  // delete cache
  await deleteCache(`${prompt.id}-${prompt.name}`);
  await deleteCache(`${prompt.id}`);
  await deleteCache(`${prompt.name}`);

  return previousVersion;
};

const deletePrompt = async ({
  id,
  name,
}: typeof DeletePromptBody.static): Promise<
  typeof DeletePromptResponse.static
> => {
  if (!id && !name) {
    // if there is no id or name in the body
    throw new Error("Invalid body");
  }

  const condition = {
    id,
    name,
  };

  // delete
  try {
    const deletedPrompt = await prisma.prompt.delete({
      where: condition,
      select: {
        id: true,
        name: true,
      },
    });
    if (!deletedPrompt) {
      return {
        message: "Prompt cannot be deleted",
        status: "error",
      };
    }

    // delete cache
    await deleteCache(`${deletedPrompt.id}-${deletePrompt.name}`);
    await deleteCache(`${deletedPrompt.id}`);
    await deleteCache(`${deletedPrompt.name}`);

    return {
      message: "Prompt deleted successfully",
      status: "success",
    };
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new PrismaError("Prompt does not exist", e.code);
      }
    }
    throw Error("Unknown error");
  }
};

export default {
  listPrompt,
  getPrompt,
  createPrompt,
  updatePrompt,
  getPromptHistories,
  getPromptVersion,
  revertPromptVersion,
  deletePrompt,
};
