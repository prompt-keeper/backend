import prisma from "../prisma";

const list_prompt = async () => {
  const prompts = await prisma.prompt.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return { prompts };
};

export default { list_prompt };
