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
// Compute daily solved count for streak tracking
export const computeDailySolvedCount = (solvedAtDates: string[]): number => {
  const today = new Date().toISOString().split("T")[0];
  return solvedAtDates.filter(d => d.startsWith(today)).length;
};

// Get top 5 recently solved problems
export const getRecentlySolvedProblems = (problems: any[], limit: number = 5) => {
  return problems
    .filter(p => p.status === "SOLVED" && p.solvedAt)
    .sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime())
    .slice(0, limit);
};
