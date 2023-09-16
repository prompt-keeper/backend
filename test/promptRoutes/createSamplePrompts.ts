import prisma from "@/prisma";

const createSamplePrompts = async () => {
  console.log("create sample prompts");
  // create 3 prompts
  const prompts = [
    {
      id: "pk_1",
      name: "prompt 1",
    },
    {
      id: "pk_2",
      name: "prompt2",
    },
    {
      id: "pk_3",
      name: "prompt3",
    },
  ];
  // create 3 prompts
  await prisma.prompt.createMany({ data: prompts });
};

export default createSamplePrompts;
