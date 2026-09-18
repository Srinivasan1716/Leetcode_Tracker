"use client";

import React from "react";
import Link from "next/link";

export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface TopicMetric {
  name: string;
  solved: number;
  total: number;
  accuracy: number;
  timeSpentMinutes: number;
}

export interface StudyLogEntry {
  id: number;
  date: string;
  title: string;
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  durationMinutes: number;
  notes?: string;
}

export interface CompanyReadiness {
  company: string;
  targetCount: number;
  completedCount: number;
  readinessPercentage: number;
}

const sampleTopicMetrics: TopicMetric[] = [
  { name: "Arrays & Hashing", solved: 18, total: 25, accuracy: 92, timeSpentMinutes: 240 },
  { name: "Two Pointers", solved: 12, total: 15, accuracy: 88, timeSpentMinutes: 180 },
  { name: "Sliding Window", solved: 9, total: 12, accuracy: 85, timeSpentMinutes: 150 },
  { name: "Binary Search", solved: 14, total: 20, accuracy: 78, timeSpentMinutes: 210 },
  { name: "Linked List", solved: 10, total: 14, accuracy: 90, timeSpentMinutes: 120 },
  { name: "Trees & Graphs", solved: 15, total: 30, accuracy: 72, timeSpentMinutes: 320 },
  { name: "Dynamic Programming", solved: 8, total: 25, accuracy: 64, timeSpentMinutes: 400 },
];

const sampleActivityData: ActivityDay[] = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-09-${(i + 1).toString().padStart(2, "0")}`,
  count: (i * 3 + 1) % 7,
  level: (((i * 3 + 1) % 7) > 4 ? 4 : ((i * 3 + 1) % 7) > 2 ? 3 : ((i * 3 + 1) % 7) > 0 ? 2 : 0) as any,
}));

const sampleLogs: StudyLogEntry[] = [
  { id: 1, date: "2026-09-18", title: "1. Two Sum", topic: "Arrays & Hashing", difficulty: "EASY", durationMinutes: 20, notes: "Hash map complement approach" },
  { id: 2, date: "2026-09-17", title: "3. Longest Substring", topic: "Sliding Window", difficulty: "MEDIUM", durationMinutes: 35, notes: "Set based sliding window" },
  { id: 3, date: "2026-09-16", title: "15. 3Sum", topic: "Two Pointers", difficulty: "MEDIUM", durationMinutes: 45, notes: "Sort array and two pointer scan" },
];

const sampleCompanies: CompanyReadiness[] = [
  { company: "Meta", targetCount: 50, completedCount: 38, readinessPercentage: 76 },
  { company: "Google", targetCount: 60, completedCount: 42, readinessPercentage: 70 },
  { company: "Amazon", targetCount: 45, completedCount: 36, readinessPercentage: 80 },
  { company: "Apple", targetCount: 30, completedCount: 24, readinessPercentage: 80 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<"7D" | "30D" | "90D" | "ALL">("30D");
  const [selectedTopicFilter, setSelectedTopicFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [logs, setLogs] = React.useState<StudyLogEntry[]>(sampleLogs);
  const [isTargetModalOpen, setIsTargetModalOpen] = React.useState<boolean>(false);
  const [monthlyGoalTarget, setMonthlyGoalTarget] = React.useState<number>(90);
  const [isLogModalOpen, setIsLogModalOpen] = React.useState<boolean>(false);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = React.useState<string>("ALL");
  const [isFavoriteOnly, setIsFavoriteOnly] = React.useState<boolean>(false);
  const [logPage, setLogPage] = React.useState<number>(1);
  const [selectedLogDetail, setSelectedLogDetail] = React.useState<StudyLogEntry | null>(null);
  const [startDateFilter, setStartDateFilter] = React.useState<string>("");
  const [endDateFilter, setEndDateFilter] = React.useState<string>("");
  const [newTitle, setNewTitle] = React.useState<string>("");
  const [newTopic, setNewTopic] = React.useState<string>("Arrays & Hashing");
  const [newDuration, setNewDuration] = React.useState<number>(30);

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newEntry: StudyLogEntry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      title: newTitle.trim(),
      topic: newTopic,
      difficulty: "MEDIUM",
      durationMinutes: newDuration,
    };
    setLogs((prev) => [newEntry, ...prev]);
    setNewTitle("");
    setIsLogModalOpen(false);
  };

  const totalLogTimeMinutes = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 md:p-10 font-sans relative flex flex-col justify-between overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full">
        
        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 sm:p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl transition-colors"
                title="Back to Dashboard"
              >
                ←
              </Link>
              <div>
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  <span>Analytics & Insights</span>
                  <span className="text-xs px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono rounded-full">
                    78.5% Solved Pace
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Performance velocity metrics, spaced repetition status & topic mastery data
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-xl transition-all"
              title="Print Summary Report"
            >
              🖨️ Print
            </button>
            <button
              onClick={() => alert("Generating full performance analytics CSV report...")}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-xl transition-all"
            >
              ↓ Export CSV
            </button>
            <Link
              href="/problems"
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-xl text-xs sm:text-sm transition-all text-center"
            >
              Problems Catalogue →
            </Link>
          </div>
        </header>

        {/* Quick Stats Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
            <p className="text-xs font-semibold text-zinc-400 uppercase">Total Study Time</p>
            <h3 className="text-2xl font-extrabold text-white mt-2">26.8 hrs</h3>
            <p className="text-[10px] text-emerald-400 mt-1">↑ +4.2 hrs vs last week</p>
          </div>
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
            <p className="text-xs font-semibold text-emerald-400 uppercase">Avg Problem Accuracy</p>
            <h3 className="text-2xl font-extrabold text-white mt-2">84.2%</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Based on first-attempt submissions</p>
          </div>
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
            <p className="text-xs font-semibold text-amber-400 uppercase">Solving Velocity</p>
            <h3 className="text-2xl font-extrabold text-white mt-2">2.4 / day</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Target pace: 3.0 / day</p>
          </div>
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
            <p className="text-xs font-semibold text-sky-400 uppercase">Topics Above 80%</p>
            <h3 className="text-2xl font-extrabold text-white mt-2">5 Categories</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Strongest: Arrays & Hashing</p>
          </div>
        </div>

        {/* Monthly Activity Heatmap Grid */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Activity Heatmap</h3>
              <p className="text-xs text-zinc-400">Daily submission activity for September 2026</p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              30 Days Recorded
            </span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
            {sampleActivityData.map((day, idx) => (
              <div
                key={idx}
                title={`${day.date}: ${day.count} problems solved`}
                className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-mono transition-all hover:scale-110 cursor-pointer ${
                  day.level === 4
                    ? "bg-amber-500 text-zinc-950 font-bold"
                    : day.level === 3
                    ? "bg-amber-500/70 text-zinc-950 font-semibold"
                    : day.level === 2
                    ? "bg-amber-500/40 text-amber-300"
                    : day.level === 1
                    ? "bg-amber-500/20 text-amber-400/80"
                    : "bg-zinc-950 text-zinc-600 border border-zinc-800/80"
                }`}
              >
                {day.count > 0 ? day.count : ""}
              </div>
            ))}
          </div>
        </div>
        {/* Difficulty Breakdown Distribution Bars */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Difficulty Ratio Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-semibold">Easy Problems (42 solved / 50 target)</span>
                <span className="font-mono text-zinc-300">84%</span>
              </div>
              <div className="h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div className="h-full bg-emerald-500 rounded-full w-[84%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-semibold">Medium Problems (65 solved / 100 target)</span>
                <span className="font-mono text-zinc-300">65%</span>
              </div>
              <div className="h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div className="h-full bg-amber-500 rounded-full w-[65%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-semibold">Hard Problems (15 solved / 40 target)</span>
                <span className="font-mono text-zinc-300">37.5%</span>
              </div>
              <div className="h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div className="h-full bg-rose-500 rounded-full w-[37.5%]"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Topic Mastery Metrics Grid */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Topic Accuracy Breakdown</h3>
            <span className="text-xs text-zinc-400 font-mono">Accuracy % on First Pass</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleTopicMetrics.map((topic) => (
              <div key={topic.name} className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{topic.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    topic.accuracy >= 85
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : topic.accuracy >= 75
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {topic.accuracy}%
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Solved: {topic.solved}/{topic.total}</span>
                  <span>Time: {topic.timeSpentMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Revision Schedule Calendar Preview */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Spaced Repetition Calendar</h3>
            <span className="text-xs text-amber-400 font-mono">3 Items Due Today</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-zinc-950/60 border border-amber-500/30 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-amber-400 font-mono">Today (Due Now)</span>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">HIGH PRIORITY</span>
              </div>
              <p className="font-semibold text-white">1. Two Sum</p>
              <p className="text-[10px] text-zinc-500">Interval: 3 Days</p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-sky-400 font-mono">Tomorrow</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">MEDIUM</span>
              </div>
              <p className="font-semibold text-white">3. Longest Substring</p>
              <p className="text-[10px] text-zinc-500">Interval: 7 Days</p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-400 font-mono">In 3 Days</span>
                <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">NORMAL</span>
              </div>
              <p className="font-semibold text-white">5. Longest Palindromic</p>
              <p className="text-[10px] text-zinc-500">Interval: 14 Days</p>
            </div>
          </div>
        </div>
        {/* Study Streak Velocity Chart Widget */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Streak Velocity Trend</h3>
            <span className="text-xs text-emerald-400 font-mono">7 Days Active 🔥</span>
          </div>
          <div className="flex items-end gap-2 h-24 pt-4 border-b border-zinc-800 pb-2">
            {[2, 3, 1, 4, 2, 5, 3].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  style={{ height: `${val * 16}px` }}
                  className="w-full bg-amber-500/80 hover:bg-amber-400 rounded-t transition-all group-hover:scale-y-105"
                ></div>
                <span className="text-[9px] text-zinc-500 font-mono">Day {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Time Spent per Category Breakdown */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Time Invested per Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 font-mono text-[10px]">Arrays & Hashing</p>
              <p className="text-lg font-bold text-amber-400 mt-1">4.0 hrs</p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 font-mono text-[10px]">Dynamic Programming</p>
              <p className="text-lg font-bold text-indigo-400 mt-1">6.6 hrs</p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 font-mono text-[10px]">Trees & Graphs</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">5.3 hrs</p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 font-mono text-[10px]">Binary Search</p>
              <p className="text-lg font-bold text-sky-400 mt-1">3.5 hrs</p>
            </div>
          </div>
        </div>
        {/* Top Performing Topics Badge Summary */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Top Performing Topics (≥ 85% Accuracy)</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
              Arrays & Hashing (92%)
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
              Linked List (90%)
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
              Two Pointers (88%)
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
              Sliding Window (85%)
            </span>
          </div>
        </div>
        {/* Weakest Topics Identify Section */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400">Needs Focus & Revision (< 75% Accuracy)</h3>
            <Link href="/problems" className="text-xs text-amber-400 hover:underline font-mono">
              Practice Weak Areas →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg">
              Dynamic Programming (64% acc, 8/25 solved)
            </span>
            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg">
              Trees & Graphs (72% acc, 15/30 solved)
            </span>
          </div>
        </div>
        {/* Target vs Actual Progress Comparison */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Monthly Target Pace vs Actual</h3>
            <span className="text-xs text-amber-400 font-mono">72 / 90 Target Solved</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-800">
            <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full w-[80%]"></div>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">You are 80% on track to reach your monthly goal of 90 problems!</p>
        </div>
        {/* Submission Acceptance Rate Overview */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-400 uppercase">First-Submission Acceptance Rate</span>
            <span className="font-mono text-emerald-400 font-bold">78.5%</span>
          </div>
          <p className="text-[11px] text-zinc-500">Out of 140 total submissions, 110 passed all test cases on first run.</p>
        </div>
        {/* Recent Study Session Activity Log Table */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Recent Study Session Logs</h3>
              <span className="text-xs text-zinc-400 font-mono">{logs.length} Entries Recorded</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search session title or topic..."
              className="px-3.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px] text-xs">
              <thead>
                <tr className="bg-zinc-950/80 text-zinc-400 uppercase font-mono border-b border-zinc-800">
                  <th className="p-3">Date</th>
                  <th className="p-3">Problem Title</th>
                  <th className="p-3">Topic</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {logs.length > 0 ? (
                  logs
                    .filter((log) =>
                      searchQuery
                        ? log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.topic.toLowerCase().includes(searchQuery.toLowerCase())
                        : true
                    )
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/40">
                        <td className="p-3 text-zinc-400">{log.date}</td>
                        <td className="p-3 text-white font-semibold">{log.title}</td>
                        <td className="p-3 text-zinc-300">{log.topic}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            log.difficulty === "EASY"
                              ? "text-emerald-400 bg-emerald-500/10"
                              : log.difficulty === "MEDIUM"
                              ? "text-amber-400 bg-amber-500/10"
                              : "text-rose-400 bg-rose-500/10"
                          }`}>
                            {log.difficulty}
                          </span>
                        </td>
                        <td className="p-3 text-amber-400">{log.durationMinutes} min</td>
                        <td className="p-3 text-zinc-400">{log.notes || "-"}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                      No study session logs recorded yet. Click "+ Log Session" to add your first entry!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
                }`}
              >
        {/* Company Interview Readiness Score Cards */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Target Company Interview Readiness</h3>
            <span className="text-xs text-amber-400 font-mono">Curated Question Solved Rate</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sampleCompanies.map((c) => (
              <div key={c.company} className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{c.company}</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">{c.readinessPercentage}%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div
                    style={{ width: `${c.readinessPercentage}%` }}
                    className="bg-amber-500 h-full rounded-full"
                  ></div>
                </div>
        {/* Problem Memory Retention Rate Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Algorithm Retention Score</h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">89% Retention Rate</span>
          </div>
          <p className="text-xs text-zinc-400">
            Based on periodic review testing, you remember optimal approaches for 89% of problems after 14 days.
          </p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Algorithm Complexity Efficiency Audit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2">
              <span className="text-zinc-400 font-semibold uppercase">Time Complexity Ratio</span>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between"><span>O(1) / O(log N)</span><span className="text-emerald-400 font-bold">35%</span></div>
                <div className="flex justify-between"><span>O(N) Linear</span><span className="text-amber-400 font-bold">48%</span></div>
                <div className="flex justify-between"><span>O(N²) Quadratic</span><span className="text-rose-400 font-bold">17%</span></div>
              </div>
            </div>
            <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2">
              <span className="text-zinc-400 font-semibold uppercase">Space Complexity Ratio</span>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between"><span>O(1) Auxiliary Space</span><span className="text-emerald-400 font-bold">52%</span></div>
                <div className="flex justify-between"><span>O(N) Hash / Stack</span><span className="text-amber-400 font-bold">41%</span></div>
                <div className="flex justify-between"><span>O(N²) Memory Matrix</span><span className="text-rose-400 font-bold">7%</span></div>
              </div>
            </div>
          </div>
        </div>
                  Solved {c.completedCount} / {c.targetCount} top tagged problems
                </p>
              </div>
            ))}
          </div>
        </div>
              </button>
            ))}
          </div>
        </div>
    </main>
  );
}
