import prisma from "@/prisma";

const createSamplePrompts = async () => {
  console.log("create sample prompts");
  // create 3 prompts
  const prompts = [
    {
      id: "pk_1",
      name: "prompt1",
      versions: {
        create: [
          {
            sha: "sha_1",
            content: "content 1",
          },
        ],
      },
    },
    {
      id: "pk_2",
      name: "prompt2",
      versions: {
        create: [
          {
            sha: "sha_2",
            createdAt: new Date("2023-09-01"),
            content: "content 2",
          },
          {
            sha: "sha_2.1",
            createdAt: new Date("2023-09-02"),
            content: "content 2.1",
          },
          {
            sha: "sha_2.2",
            createdAt: new Date("2023-09-03"),
            content: "content 2.2",
          },
        ],
      },
    },
    {
      id: "pk_3",
      name: "prompt3",
      versions: {
        create: [
          {
            sha: "sha_3.1",
            createdAt: new Date("2023-09-01"),
            content: "content 3.1",
          },
          {
            sha: "sha_3.2",
            createdAt: new Date("2023-09-02"),
            content: "content 3.2",
          },
        ],
      },
    },
  ];
  // create 3 prompts
  await prisma.$transaction(
    prompts.map((prompt) => prisma.prompt.create({ data: prompt })),
  );
};

export default createSamplePrompts;
