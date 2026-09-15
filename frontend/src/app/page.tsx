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

export default function Home() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  // UI Interactive State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
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

    fetchDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">LeetCode Tracker</h1>
          <p className="text-zinc-400 mt-2">Track your code on our dashboard</p>
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading dashboard...</p>
        ) : dashboard ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <p className="text-zinc-400">Total Problems</p>
              <h2 className="text-3xl font-bold mt-2">{dashboard.totalProblems}</h2>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <p className="text-zinc-400">Solved</p>
              <h2 className="text-3xl font-bold mt-2">{dashboard.solved}</h2>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <p className="text-zinc-400">In Progress</p>
              <h2 className="text-3xl font-bold mt-2">{dashboard.inProgress}</h2>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <p className="text-zinc-400">Not Started</p>
              <h2 className="text-3xl font-bold mt-2">{dashboard.notStarted}</h2>
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