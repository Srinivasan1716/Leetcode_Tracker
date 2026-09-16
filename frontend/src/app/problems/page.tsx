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

const initialProblemsList: ProblemItem[] = [
  { id: 1, title: "1. Two Sum", difficulty: "EASY", topic: "Arrays & Hashing", status: "SOLVED", link: "https://leetcode.com/problems/two-sum/", isBookmarked: true },
  { id: 2, title: "2. Add Two Numbers", difficulty: "MEDIUM", topic: "Linked List", status: "IN_PROGRESS", link: "https://leetcode.com/problems/add-two-numbers/" },
  { id: 3, title: "3. Longest Substring Without Repeating Characters", difficulty: "MEDIUM", topic: "Sliding Window", status: "SOLVED", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", isBookmarked: true },
  { id: 4, title: "4. Median of Two Sorted Arrays", difficulty: "HARD", topic: "Binary Search", status: "NOT_STARTED", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { id: 5, title: "5. Longest Palindromic Substring", difficulty: "MEDIUM", topic: "Dynamic Programming", status: "SOLVED", link: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: 6, title: "11. Container With Most Water", difficulty: "MEDIUM", topic: "Two Pointers", status: "SOLVED", link: "https://leetcode.com/problems/container-with-most-water/" },
  { id: 7, title: "15. 3Sum", difficulty: "MEDIUM", topic: "Two Pointers", status: "IN_PROGRESS", link: "https://leetcode.com/problems/3sum/" },
  { id: 8, title: "20. Valid Parentheses", difficulty: "EASY", topic: "Stack & Queue", status: "SOLVED", link: "https://leetcode.com/problems/valid-parentheses/" },
];

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
  const [problemsList, setProblemsList] = useState<ProblemItem[]>(initialProblemsList);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredProblems = problemsList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "ALL" || item.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesTopic = selectedTopic === "ALL" || item.topic === selectedTopic;
    return matchesSearch && matchesDifficulty && matchesStatus && matchesTopic;
  });

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

        {/* Quick Stats Grid Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-zinc-400 uppercase">Total Listed</p>
            <h3 className="text-2xl font-bold text-white mt-1">{problemsList.length}</h3>
          </div>
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-emerald-400 uppercase">Solved</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {problemsList.filter((p) => p.status === "SOLVED").length}
            </h3>
          </div>
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-sky-400 uppercase">In Progress</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {problemsList.filter((p) => p.status === "IN_PROGRESS").length}
            </h3>
          </div>
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-rose-400 uppercase">Hard Mastered</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {problemsList.filter((p) => p.difficulty === "HARD" && p.status === "SOLVED").length}
            </h3>
          </div>
        </div>

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

        {/* Problems Table View Header */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Problem</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Difficulty</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {filteredProblems.map((prob) => (
                  <tr key={prob.id} className="hover:bg-zinc-800/40 transition-all">
                    <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                      <span>{prob.title}</span>
                      {prob.link && (
                        <a
                          href={prob.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-amber-400 transition-colors"
                        >
                          ↗
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-6 text-zinc-400 text-xs font-mono">
                      {prob.topic}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getStatusBadgeStyle(prob.status)}`}>
                        {prob.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-xs text-zinc-400 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
