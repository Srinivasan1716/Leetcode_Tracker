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
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Analytics & Progress Tracker</h1>
        <p className="text-xs text-zinc-400">Detailed insights into problem solving velocity and revision schedules</p>
      </div>
    </main>
  );
}
