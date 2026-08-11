import prisma from "../lib/prisma";

export const createProblem = async (
  title: string,
  description: string | undefined,
  difficulty: string,
  topic: string | undefined,
  link: string | undefined
) => {
  const problem = await prisma.problem.create({
    data: {
      title,
      description,
      difficulty,
      topic,
      link,
    },
  });

  return problem;
};

export const getAllProblems = async () => {
  const problems = await prisma.problem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return problems;
};

export const getProblemById = async (id: number) => {
  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
  });

  return problem;
};