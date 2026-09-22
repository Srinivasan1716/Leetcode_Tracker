"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Interface definitions for LeetCode Tracker Dashboard
 */
export interface Problem {
  id: number;
  title: string;
  description?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic?: string;
  link?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SOLVED";
  solvedAt?: string;
  tags?: string[];
}

export interface TopicStat {
  name: string;
  total: number;
  solved: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  dailyTarget: number;
  completedToday: number;
}

export interface StudySession {
  id: number;
  problemTitle: string;
  durationMinutes: number;
  date: string;
}

export interface RevisionSchedule {
  problemId: number;
  title: string;
  dueDate: string;
  intervalDays: number;
}

export interface Dashboard {
  totalProblems: number;
  solved: number;
  inProgress: number;
  notStarted: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyTotal?: number;
  mediumTotal?: number;
  hardTotal?: number;
  recentProblems?: Problem[];
  topicStats?: TopicStat[];
  streak?: UserStreak;
}

/**
 * Utility helper functions for badge styling and progress percentage calculations
 */
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toUpperCase()) {
    case "EASY":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "MEDIUM":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "HARD":
      return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  }
};

const getStatusBadge = (status: string) => {
  switch (status?.toUpperCase()) {
    case "SOLVED":
      return "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
    case "IN_PROGRESS":
      return "text-sky-400 bg-sky-500/15 border-sky-500/30";
    case "NOT_STARTED":
    default:
      return "text-zinc-400 bg-zinc-800 border-zinc-700";
  }
};

const calculatePercentage = (count: number, total: number) => {
  if (!total || total === 0) return 0;
  return Math.round((count / total) * 100);
};

// Fallback sample data when backend returns initial empty lists
const sampleProblems: Problem[] = [
  { id: 1, title: "Two Sum", difficulty: "EASY", topic: "Arrays & Hashing", status: "SOLVED", link: "https://leetcode.com/problems/two-sum/", solvedAt: "2026-03-10", tags: ["Blind 75", "NeetCode 150"] },
  { id: 2, title: "Add Two Numbers", difficulty: "MEDIUM", topic: "Linked List", status: "IN_PROGRESS", link: "https://leetcode.com/problems/add-two-numbers/", tags: ["NeetCode 150"] },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM", topic: "Sliding Window", status: "SOLVED", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", tags: ["Blind 75", "Must Review"] },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "HARD", topic: "Binary Search", status: "NOT_STARTED", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/", tags: ["Company Top"] },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "MEDIUM", topic: "Dynamic Programming", status: "SOLVED", link: "https://leetcode.com/problems/longest-palindromic-substring/", tags: ["Blind 75"] },
];

const defaultTopics: TopicStat[] = [
  { name: "Arrays and Hashing", total: 15, solved: 10 },
  { name: "Two Pointers", total: 8, solved: 5 },
  { name: "Sliding Window", total: 6, solved: 4 },
  { name: "Stack and Queue", total: 7, solved: 3 },
  { name: "Binary Search", total: 9, solved: 6 },
  { name: "Linked List", total: 6, solved: 4 },
  { name: "Trees & Graphs", total: 14, solved: 7 },
  { name: "Dynamic Programming", total: 12, solved: 5 },
];

const defaultStreak: UserStreak = {
  currentStreak: 7,
  longestStreak: 14,
  dailyTarget: 3,
  completedToday: 2,
};

const sampleRevisions: RevisionSchedule[] = [
  { problemId: 1, title: "1. Two Sum", dueDate: "Today", intervalDays: 3 },
  { problemId: 3, title: "3. Longest Substring Without Repeating Characters", dueDate: "Tomorrow", intervalDays: 7 },
  { problemId: 5, title: "5. Longest Palindromic Substring", dueDate: "In 3 Days", intervalDays: 14 },
];

const sampleSessions: StudySession[] = [
  { id: 1, problemTitle: "Two Sum", durationMinutes: 25, date: "2026-09-16" },
  { id: 2, problemTitle: "Longest Substring", durationMinutes: 40, date: "2026-09-17" },
];

export default function Home() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Local state for interactive problem manipulation
  const [problems, setProblems] = useState<Problem[]>(sampleProblems);

  // Search & filtering state management
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeTagFilter, setActiveTagFilter] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"ALL" | "REVISION" | "FAVORITES">("ALL");
  const [selectedProblemDrawer, setSelectedProblemDrawer] = useState<Problem | null>(null);
  const [dailyTargetGoal, setDailyTargetGoal] = useState(3);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Add problem form fields
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [newLink, setNewLink] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/1");
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      setDashboard(data.dashboard);
      if (data.dashboard?.recentProblems?.length) {
        setProblems(data.dashboard.recentProblems);
      }
    } catch (error: any) {
      console.error("Dashboard error:", error);
      setErrorMessage(error?.message || "Failed to establish connection to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleStatus = (id: number) => {
    setProblems((prev) =>
      prev.map((prob) => {
        if (prob.id !== id) return prob;
        const nextStatus: Problem["status"] =
          prob.status === "NOT_STARTED"
            ? "IN_PROGRESS"
            : prob.status === "IN_PROGRESS"
            ? "SOLVED"
            : "NOT_STARTED";
        return { ...prob, status: nextStatus };
      })
    );
  };

  const handleAddProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEntry: Problem = {
      id: Date.now(),
      title: newTitle.trim(),
      topic: newTopic.trim() || "General",
      difficulty: newDifficulty,
      link: newLink.trim() || undefined,
      status: "NOT_STARTED",
      tags: ["User Added"],
    };

    setProblems((prev) => [newEntry, ...prev]);

    // Form cleanup
    setNewTitle("");
    setNewTopic("");
    setNewDifficulty("EASY");
    setNewLink("");
    setIsAddModalOpen(false);
  };

  const topicList = dashboard?.topicStats && dashboard.topicStats.length > 0 
    ? dashboard.topicStats 
    : defaultTopics;

  const streakInfo = dashboard?.streak || defaultStreak;

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (problem.topic && problem.topic.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty =
      difficultyFilter === "ALL" || problem.difficulty === difficultyFilter;

    const matchesStatus =
      statusFilter === "ALL" || problem.status === statusFilter;

    const matchesTag =
      activeTagFilter === "ALL" || (problem.tags && problem.tags.includes(activeTagFilter));

    return matchesSearch && matchesDifficulty && matchesStatus && matchesTag;
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 md:p-10 font-sans relative flex flex-col justify-between overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full">
        
        {/* Navigation & Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl font-bold text-xl">
                LT
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  LeetCode Tracker
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Monitor solving progress, algorithms & data structures metrics
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/problems"
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg text-xs sm:text-sm font-medium text-amber-400 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Problems Catalogue →</span>
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Problem
            </button>

            <button
              onClick={() => fetchDashboard()}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg text-xs sm:text-sm font-medium text-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {loading ? (
          /* Animated Skeleton Loading State UI */
          <div className="space-y-8 animate-pulse">
            <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-2xl w-full"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-44 bg-zinc-900 border border-zinc-800 rounded-2xl"></div>
          </div>
        ) : errorMessage ? (
          /* Graceful Error UI Banner */
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 md:p-8 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">⚠️</span>
              <h3 className="text-lg font-bold text-rose-300">Backend Connection Error</h3>
            </div>
            <p className="text-sm text-zinc-300">
              {errorMessage}
            </p>
            <div className="text-xs text-zinc-400 space-y-1">
              <p>• Ensure your Node backend server is running locally on <code className="text-amber-400">http://localhost:5000</code>.</p>
              <p>• Check if database migrations are up to date using <code className="text-amber-400">npx prisma migrate dev</code>.</p>
            </div>
            <button
              onClick={() => fetchDashboard()}
              className="mt-2 px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-semibold rounded-lg text-xs transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : dashboard ? (
          <div className="space-y-6 sm:space-y-8">
            
            {/* Daily Streak Banner Card */}
            <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-indigo-500/10 border border-amber-500/20 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-2xl text-2xl animate-bounce">
                  🔥
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {streakInfo.currentStreak} Day Streak Active!
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Personal best: {streakInfo.longestStreak} days. Keep solving daily to maintain your momentum!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 bg-zinc-950/60 border border-zinc-800 px-6 py-3 rounded-xl w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-1.5">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-zinc-500 font-mono">{day}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          idx < 5
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                        }`}
                      >
                        {idx < 5 ? "✓" : "•"}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-zinc-500 uppercase font-semibold">Today Target</p>
                    <button
                      onClick={() => setIsEditingTarget(!isEditingTarget)}
                      className="text-[10px] text-amber-400 hover:underline font-mono"
                    >
                      {isEditingTarget ? "Done" : "Edit"}
                    </button>
                  </div>
                  {isEditingTarget ? (
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={dailyTargetGoal}
                      onChange={(e) => setDailyTargetGoal(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-0.5 mt-1 bg-zinc-900 border border-amber-500/50 rounded text-xs text-amber-400 font-bold focus:outline-none"
                    />
                  ) : (
                    <p className="text-base sm:text-lg font-bold text-amber-400">
                      {streakInfo.completedToday} / {dailyTargetGoal} Solved
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-400">
                  {calculatePercentage(streakInfo.completedToday, dailyTargetGoal)}%
                </div>
              </div>
            </div>

            {/* Spaced Repetition Revision Reminders */}
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg text-xs">🔔</span>
                  <h3 className="text-sm font-bold text-white">Upcoming Revisions (Spaced Repetition)</h3>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">3 Due This Week</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleRevisions.map((rev) => (
                  <div key={rev.problemId} className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-between text-xs">
                    <div className="truncate mr-2">
                      <p className="font-semibold text-zinc-200 truncate">{rev.title}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Interval: {rev.intervalDays}d</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[10px] font-mono whitespace-nowrap">
                      {rev.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Total Problems Card */}
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-5 sm:p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Total Tracked
                  </p>
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  {dashboard.totalProblems}
                </h2>
                <p className="text-xs text-zinc-500 mt-2">
                  All active problems in collection
                </p>
              </div>

              {/* Solved Card */}
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-5 sm:p-6 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-black/40">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Solved
                  </p>
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {dashboard.solved}
                  </h2>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {calculatePercentage(dashboard.solved, dashboard.totalProblems)}%
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Successfully accepted solutions
                </p>
              </div>

              {/* In Progress Card */}
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-5 sm:p-6 transition-all hover:border-sky-500/30 hover:shadow-lg hover:shadow-black/40">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                    In Progress
                  </p>
                  <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  {dashboard.inProgress}
                </h2>
                <p className="text-xs text-zinc-500 mt-2">
                  Currently revising or attempt pending
                </p>
              </div>

              {/* Not Started Card */}
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-5 sm:p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Not Started
                  </p>
                  <div className="p-2.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  {dashboard.notStarted}
                </h2>
                <p className="text-xs text-zinc-500 mt-2">
                  Queued in study roadmap
                </p>
              </div>

            </div>

            {/* Daily Practice Goals Widget Banner */}
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl font-bold">
                  🎯
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Daily Target Velocity</h4>
                  <p className="text-xs text-zinc-400">Targeting {dailyTargetGoal} problem solutions every day for optimal interview readiness</p>
                </div>
              </div>
              <div className="w-full sm:w-64 bg-zinc-950/80 p-2 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Pace Progress</span>
                <span className="font-bold text-amber-400 font-mono">
                  {streakInfo.completedToday >= dailyTargetGoal ? "Goal Met! 🔥" : `${dailyTargetGoal - streakInfo.completedToday} left today`}
                </span>
              </div>
            </div>
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Difficulty Breakdown</h2>
                  <p className="text-xs text-zinc-400">Problem completion distribution across difficulty tiers</p>
                </div>
                <span className="text-xs font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full w-fit">
                  Overall: {calculatePercentage(dashboard.solved, dashboard.totalProblems)}% Complete
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Easy Tier */}
                <div className="p-4 sm:p-5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-emerald-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Easy
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                        {calculatePercentage(dashboard.easySolved, dashboard.easyTotal || dashboard.easySolved || 1)}%
                      </span>
                    </span>
                    <span className="text-zinc-300 font-mono">
                      {dashboard.easySolved} <span className="text-zinc-500">/ {dashboard.easyTotal || dashboard.easySolved || 0}</span>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${calculatePercentage(dashboard.easySolved, dashboard.easyTotal || dashboard.easySolved || 1)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Medium Tier */}
                <div className="p-4 sm:p-5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-amber-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Medium
                    </span>
                    <span className="text-zinc-300 font-mono">
                      {dashboard.mediumSolved} <span className="text-zinc-500">/ {dashboard.mediumTotal || dashboard.mediumSolved || 0}</span>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${calculatePercentage(dashboard.mediumSolved, dashboard.mediumTotal || dashboard.mediumSolved || 1)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Hard Tier */}
                <div className="p-4 sm:p-5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-rose-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      Hard
                    </span>
                    <span className="text-zinc-300 font-mono">
                      {dashboard.hardSolved} <span className="text-zinc-500">/ {dashboard.hardTotal || dashboard.hardSolved || 0}</span>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${calculatePercentage(dashboard.hardSolved, dashboard.hardTotal || dashboard.hardSolved || 1)}%`,
                      }}
                    ></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive Search & Filter Controls Toolbar */}
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problem title or topic tag..."
                    className="w-full pl-11 pr-10 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition-all"
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 font-mono text-xs"
                    >
                      ✕
                    </button>
                  ) : (
                    <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 rounded pointer-events-none">
                      /
                    </kbd>
                  )}
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Difficulty Selector */}
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>

                  {/* Status Buttons */}
                  <div className="flex bg-zinc-950/80 border border-zinc-800 rounded-xl p-1 text-xs font-medium overflow-x-auto max-w-full">
                    {["ALL", "SOLVED", "IN_PROGRESS", "NOT_STARTED"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                          statusFilter === st
                            ? "bg-zinc-800 text-white font-semibold"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {st === "ALL" ? "All" : st.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Study List Preset Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60 text-xs">
                <span className="text-zinc-500 font-medium">Curated Lists:</span>
                {["ALL", "Blind 75", "NeetCode 150", "Must Review", "Company Top", "Meta", "Google", "Amazon"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTagFilter(tag)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      activeTagFilter === tag
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold"
                        : "bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Table List */}
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Problem Collection</h2>
                  <p className="text-xs text-zinc-400">Showing {filteredProblems.length} matching problem entries</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1 text-xs font-mono">
                    {(["ALL", "REVISION", "FAVORITES"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveViewTab(tab)}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          activeViewTab === tab
                            ? "bg-zinc-800 text-amber-400 font-bold"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => alert(`Exporting ${filteredProblems.length} problem records...`)}
                    className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 transition-all"
                  >
                    ↓ Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-zinc-950/60 border-b border-zinc-800/80 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Title</th>
                      <th className="py-3.5 px-6">Topic</th>
                      <th className="py-3.5 px-6">Difficulty</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-sm">
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((prob) => (
                        <tr key={prob.id} className="hover:bg-zinc-800/40 transition-all">
                          <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                            <button
                              onClick={() => {
                                setProblems((prev) =>
                                  prev.map((p) => (p.id === prob.id ? { ...p, tags: p.tags?.includes("Favorite") ? p.tags.filter(t => t !== "Favorite") : [...(p.tags || []), "Favorite"] } : p))
                                );
                              }}
                              className={`text-base transition-transform active:scale-125 ${
                                prob.tags?.includes("Favorite") ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"
                              }`}
                              title="Toggle Favorite"
                            >
                              ★
                            </button>
                            <span>{prob.title}</span>
                            {prob.link && (
                              <a
                                href={prob.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-zinc-500 hover:text-amber-400 transition-colors"
                                title="Open on LeetCode"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </td>
                          <td className="py-4 px-6 text-zinc-400 text-xs font-mono">
                            {prob.topic || "General"}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getDifficultyColor(prob.difficulty)}`}>
                              {prob.difficulty}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getStatusBadge(prob.status)}`}>
                              {prob.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedProblemDrawer(prob)}
                              className="text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1.5 rounded-lg border border-zinc-700 transition-all"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleToggleStatus(prob.id)}
                              className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                            >
                              Cycle Status
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-500 text-sm">
                          No problems match your current search and filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer Bar */}
              <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Showing {filteredProblems.length} matching entries</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span>Page {currentPage}</span>
                  <button
                    disabled={currentPage * itemsPerPage >= filteredProblems.length}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Topic Mastery Categories */}
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Topic Mastery</h2>
                  <p className="text-xs text-zinc-400">Progress across Data Structure & Algorithm categories</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Top Category:</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    Arrays & Hashing (66%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topicList.map((topic, index) => {
                  const pct = calculatePercentage(topic.solved, topic.total);
                  return (
                    <div
                      key={index}
                      onClick={() => setSearchQuery(topic.name)}
                      className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/60 hover:border-amber-500/40 transition-all cursor-pointer space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors truncate">
                          {topic.name}
                        </h3>
                        <span className="text-xs font-mono text-zinc-400">
                          {topic.solved}/{topic.total}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : null}
      </div>

      {/* Footer Branding */}
      <footer className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-[11px] text-zinc-400">System Status: Operational</span>
        </div>
        <p>LeetCode Tracker &copy; {new Date().getFullYear()} • Built with Next.js & TypeScript</p>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <a href="https://github.com/Srinivasan1716/Leetcode_Tracker" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
            GitHub Repo
          </a>
          <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
            LeetCode ↗
          </a>
        </div>
      </footer>

      {/* Problem Details Side Drawer */}
      {selectedProblemDrawer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-md p-6 space-y-5 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">{selectedProblemDrawer.title}</h3>
              <button
                onClick={() => setSelectedProblemDrawer(null)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-lg"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-zinc-500 font-semibold uppercase">Topic Category</p>
                <p className="text-zinc-200 mt-1 font-mono">{selectedProblemDrawer.topic || "General"}</p>
              </div>
              <div>
                <p className="text-zinc-500 font-semibold uppercase">Difficulty</p>
                <span className={`inline-block mt-1 px-2.5 py-1 rounded-full font-semibold border ${getDifficultyColor(selectedProblemDrawer.difficulty)}`}>
                  {selectedProblemDrawer.difficulty}
                </span>
              </div>
              <div>
                <p className="text-zinc-500 font-semibold uppercase">Status</p>
                <span className={`inline-block mt-1 px-2.5 py-1 rounded-full font-semibold border ${getStatusBadge(selectedProblemDrawer.status)}`}>
                  {selectedProblemDrawer.status.replace("_", " ")}
                </span>
              </div>
              {selectedProblemDrawer.link && (
                <div>
                  <p className="text-zinc-500 font-semibold uppercase">LeetCode Link</p>
                  <a
                    href={selectedProblemDrawer.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline mt-1 block truncate font-mono"
                  >
                    {selectedProblemDrawer.link}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Problem Modal Interface */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">Add New Problem</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddProblemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Problem Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 3Sum"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-zinc-500 mt-1">Include the LeetCode number prefix for easier search identification (e.g. 15. 3Sum)</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Topic Category
                </label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Two Pointers"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Difficulty Tier
                </label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  LeetCode URL Link
                </label>
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
// Live LeetCode Sync Listener Hook
export const useLeetCodeSync = (onSync?: (data: any) => void) => {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'LEETCODE_SUBMISSION_SYNCED') onSync?.(e.data.payload);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onSync]);
};

// Quick Problem Filter State Type
export type QuickFilterMode = 'ALL' | 'SOLVED_ONLY' | 'REVISION_DUE' | 'IN_PROGRESS';

// Streak Milestone Badge Generator
export const getStreakBadge = (streak: number) => {
  if (streak >= 30) return { title: 'Coding Master', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  if (streak >= 7) return { title: 'Consistent Solver', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  return { title: 'Getting Started', color: 'text-zinc-400 bg-zinc-800 border-zinc-700' };
};

// Weekly Target Progress Calculator
export const computeWeeklyTarget = (completed: number, target: number = 10) => ({
  completed,
  target,
  percentage: Math.min(100, Math.round((completed / target) * 100))
});

// Difficulty Tier Distribution Breakdown helper
export const computeDifficultyStats = (easy: number, med: number, hard: number) => {
  const total = easy + med + hard || 1;
  return { easyRate: (easy / total) * 100, medRate: (med / total) * 100, hardRate: (hard / total) * 100 };
};

// Problem Solving Active Timer State
export interface ActiveTimerState {
  seconds: number;
  isRunning: boolean;
  problemId?: number;
}

// Timer format helper
export const formatTimerSeconds = (sec: number) => {
  const mins = Math.floor(sec / 60);
  const remSec = sec % 60;
  return `${String(mins).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
};

// Session Custom Notes State Interface
export interface ProblemSessionNote {
  problemId: number;
  content: string;
  lastUpdated: string;
}

// Auto Algorithm Pattern Classification Helper
export const classifyAlgorithmPattern = (title: string, tags: string[] = []) => {
  const text = (title + ' ' + tags.join(' ')).toLowerCase();
  if (text.includes('tree') || text.includes('bst')) return 'Tree Traversal';
  if (text.includes('window') || text.includes('subarray')) return 'Sliding Window';
  if (text.includes('graph') || text.includes('bfs') || text.includes('dfs')) return 'Graph Theory';
  if (text.includes('dp') || text.includes('knapsack')) return 'Dynamic Programming';
  return 'General Array & Logic';
};

// Interview Readiness Score Calculator
export const calculateReadinessScore = (solved: number, hardCount: number, topicsCovered: number) => {
  const score = Math.min(100, Math.round((solved * 0.4) + (hardCount * 1.5) + (topicsCovered * 3)));
  return score;
};
