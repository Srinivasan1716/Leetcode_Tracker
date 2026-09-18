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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<"7D" | "30D" | "90D" | "ALL">("30D");
  const [selectedTopicFilter, setSelectedTopicFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [logs, setLogs] = React.useState<StudyLogEntry[]>(sampleLogs);
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
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
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Analytics & Insights
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Performance velocity metrics, spaced repetition status & topic mastery data
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
              <span className="text-[10px] text-amber-400 font-mono">Today (Due Now)</span>
              <p className="font-semibold text-white">1. Two Sum</p>
              <p className="text-[10px] text-zinc-500">Interval: 3 Days</p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-1">
              <span className="text-[10px] text-sky-400 font-mono">Tomorrow</span>
              <p className="font-semibold text-white">3. Longest Substring</p>
              <p className="text-[10px] text-zinc-500">Interval: 7 Days</p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-400 font-mono">In 3 Days</span>
              <p className="font-semibold text-white">5. Longest Palindromic</p>
              <p className="text-[10px] text-zinc-500">Interval: 14 Days</p>
            </div>
          </div>
        </div>
            {(["7D", "30D", "90D", "ALL"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeRange === range
                    ? "bg-amber-500 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
    </main>
  );
}
