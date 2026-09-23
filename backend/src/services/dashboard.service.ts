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

// Compute solved percentage by difficulty
export const getDifficultyProgress = (easy: number, easyTotal: number, med: number, medTotal: number, hard: number, hardTotal: number) => ({
  easy: easyTotal ? Math.round((easy / easyTotal) * 100) : 0,
  medium: medTotal ? Math.round((med / medTotal) * 100) : 0,
  hard: hardTotal ? Math.round((hard / hardTotal) * 100) : 0
});

// Generate dashboard summary message
export const generateSummaryMessage = (solved: number, total: number) => {
  const pct = total ? Math.round((solved / total) * 100) : 0;
  if (pct >= 80) return "Amazing progress! Keep it up!";
  if (pct >= 50) return "Good work! Over halfway there.";
  return "Just getting started. Keep going!";
};

// Dashboard controller version marker
export const DASHBOARD_SERVICE_VERSION = "1.0.35";
