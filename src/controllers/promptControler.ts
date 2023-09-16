import prisma from "../prisma";

const listPrompt = async () => {
  const prompts = await prisma.prompt.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return { prompts };
};

const getPrompt = (body: { id: string } | { name: string }) => {
  if ("id" in body && "name" in body) {
    throw new Error("Invalid payload, cannot contain both id and name");
  }

  if ("id" in body) {
    return getPromptById(body.id);
  }

  if ("name" in body) {
    return getPromptByName(body.name);
  }
  throw new Error("Invalid payload");
};

const getPromptById = async (id: string) => {
  const prompt = await prisma.prompt.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return prompt;
};

const getPromptByName = async (name: string) => {
  const prompt = await prisma.prompt.findUnique({
    where: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return prompt;
};

export default { listPrompt, getPromptById, getPromptByName, getPrompt };
