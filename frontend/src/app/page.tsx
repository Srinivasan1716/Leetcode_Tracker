"use client";

import { useEffect, useState } from "react";

// Types & Interfaces for LeetCode Tracker
export interface Problem {
  id: number;
  title: string;
  description?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic?: string;
  link?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SOLVED";
  solvedAt?: string;
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

// Utility formatting functions
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

export default function Home() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  // UI Interactive State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/1");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
      }
      const data = await response.json();
      setDashboard(data.dashboard);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl font-bold text-xl">
                LT
              </span>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  LeetCode Tracker
                </h1>
                <p className="text-sm text-zinc-400">
                  Monitor solving progress, algorithms & data structures metrics
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Backend Connected (Port 5000)</span>
            </div>

            <button
              onClick={() => fetchDashboard()}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg text-sm font-medium text-zinc-200 transition-all flex items-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        {loading ? (
          <p className="text-zinc-400">Loading dashboard...</p>
        ) : dashboard ? (
          <div className="space-y-8">
            {/* Enhanced Statistics Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Problems Card */}
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40">
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
                <h2 className="text-3xl font-extrabold text-white mt-3">
                  {dashboard.totalProblems}
                </h2>
                <p className="text-xs text-zinc-500 mt-2">
                  All active problems in collection
                </p>
              </div>

              {/* Solved Card */}
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-6 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-black/40">
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
                  <h2 className="text-3xl font-extrabold text-white">
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
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-6 transition-all hover:border-sky-500/30 hover:shadow-lg hover:shadow-black/40">
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
                <h2 className="text-3xl font-extrabold text-white mt-3">
                  {dashboard.inProgress}
                </h2>
                <p className="text-xs text-zinc-500 mt-2">
                  Currently revising or attempt pending
                </p>
              </div>

              {/* Not Started Card */}
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800/90 rounded-2xl p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40">
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
                <h2 className="text-3xl font-extrabold text-white mt-3">
                  {dashboard.notStarted}
                </h2>
                <p className="text-xs text-zinc-500 mt-2">
                  Queued in study roadmap
                </p>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <p className="text-red-400">Unable to load dashboard.</p>
          </div>
        )}
      </div>
    </main>
  );
}