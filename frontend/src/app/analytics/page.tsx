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

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Analytics & Progress Tracker</h1>
        <p className="text-xs text-zinc-400">Detailed insights into problem solving velocity and revision schedules</p>
      </div>
    </main>
  );
}
