import prisma from "../lib/prisma";

export const updateProblemStatus = async (
  userId: number,
  problemId: number,
  status: string
) => {
  const userProblem = await prisma.userProblem.upsert({
    where: {
      userId_problemId: {
        userId,
        problemId,
      },
    },
    update: {
      status,
      solvedAt: status === "SOLVED" ? new Date() : null,
    },
    create: {
      userId,
      problemId,
      status,
      solvedAt: status === "SOLVED" ? new Date() : null,
    },
  });

  return userProblem;
};

export const getUserProblems = async (userId: number) => {
  const problems = await prisma.userProblem.findMany({
    where: {
      userId,
    },
    include: {
      problem: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return problems;
};

export const getUserProblem = async (
  userId: number,
  problemId: number
) => {
  const userProblem = await prisma.userProblem.findUnique({
    where: {
      userId_problemId: {
        userId,
        problemId,
      },
    },
    include: {
      problem: true,
    },
  });

  return userProblem;
};