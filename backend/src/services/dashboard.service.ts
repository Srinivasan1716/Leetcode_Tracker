import prisma from "../lib/prisma";

export const getUserDashboard = async (userId: number) => {
  const totalProblems = await prisma.problem.count();

  const solved = await prisma.userProblem.count({
    where: {
      userId,
      status: "SOLVED",
    },
  });

  const inProgress = await prisma.userProblem.count({
    where: {
      userId,
      status: "IN_PROGRESS",
    },
  });

  const notStarted = totalProblems - solved - inProgress;

  const easySolved = await prisma.userProblem.count({
    where: {
      userId,
      status: "SOLVED",
      problem: {
        difficulty: "Easy",
      },
    },
  });

  const mediumSolved = await prisma.userProblem.count({
    where: {
      userId,
      status: "SOLVED",
      problem: {
        difficulty: "Medium",
      },
    },
  });

  const hardSolved = await prisma.userProblem.count({
    where: {
      userId,
      status: "SOLVED",
      problem: {
        difficulty: "Hard",
      },
    },
  });

  return {
    totalProblems,
    solved,
    inProgress,
    notStarted,
    easySolved,
    mediumSolved,
    hardSolved,
  };
};