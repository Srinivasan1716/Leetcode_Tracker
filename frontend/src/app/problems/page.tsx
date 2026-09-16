"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface ProblemItem {
  id: number;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SOLVED";
  link?: string;
  isBookmarked?: boolean;
  notes?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  lastRevised?: string;
}

export interface FilterOptions {
  searchQuery: string;
  difficulty: string;
  status: string;
  topic: string;
}

// Utility styling helpers
export const getDifficultyColor = (difficulty: string) => {
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

export const getStatusBadgeStyle = (status: string) => {
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

const topicCategories = [
  "ALL",
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack & Queue",
  "Binary Search",
  "Linked List",
  "Trees & Graphs",
  "Dynamic Programming",
  "Heap / Priority Queue",
];

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 md:p-10 font-sans space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl transition-colors"
                title="Back to Dashboard"
              >
                ←
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Problems Repository
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Comprehensive catalogue of algorithms, data structures & practice questions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              + New Problem Entry
            </button>
          </div>
        </header>

        {/* Search & Topic Filter Controls */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem name or topic..."
                className="w-full pl-4 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {/* Topic Category Select */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full md:w-56 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-amber-500/60"
            >
              {topicCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "ALL" ? "All Topics" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Tier Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60 text-xs">
            <span className="text-zinc-500 font-medium">Difficulty:</span>
            {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  difficultyFilter === diff
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {diff === "ALL" ? "All Difficulties" : diff}
              </button>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
