import { NotFoundError } from "@/errors";
import prisma from "@/prisma";

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

export default { listPrompt, getPrompt };
