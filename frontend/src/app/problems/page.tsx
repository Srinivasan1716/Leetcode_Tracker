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
  codeSnippet?: string;
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
  { 
    id: 1, 
    title: "1. Two Sum", 
    difficulty: "EASY", 
    topic: "Arrays & Hashing", 
    status: "SOLVED", 
    link: "https://leetcode.com/problems/two-sum/", 
    isBookmarked: true, 
    notes: "Use Hash Map to store complement (target - num). O(n) time, O(n) space.", 
    codeSnippet: "function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    timeComplexity: "O(N)", 
    spaceComplexity: "O(N)" 
  },
  { id: 2, title: "2. Add Two Numbers", difficulty: "MEDIUM", topic: "Linked List", status: "IN_PROGRESS", link: "https://leetcode.com/problems/add-two-numbers/", notes: "Traverse both lists with carry variable.", timeComplexity: "O(Max(N,M))", spaceComplexity: "O(1)" },
  { id: 3, title: "3. Longest Substring Without Repeating Characters", difficulty: "MEDIUM", topic: "Sliding Window", status: "SOLVED", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", isBookmarked: true, notes: "Maintain sliding window set of character frequencies.", timeComplexity: "O(N)", spaceComplexity: "O(K)" },
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [sortBy, setSortBy] = useState<"DEFAULT" | "TITLE" | "DIFFICULTY">("DEFAULT");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProblemDrawer, setSelectedProblemDrawer] = useState<ProblemItem | null>(null);

  // New problem form fields
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("Arrays & Hashing");
  const [newDifficulty, setNewDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [newLink, setNewLink] = useState("");

  const resetAllFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("ALL");
    setStatusFilter("ALL");
    setSelectedTopic("ALL");
    setSortBy("DEFAULT");
    setCurrentPage(1);
  };

  const handleToggleStatus = (id: number) => {
    setProblemsList((prev) =>
      prev.map((prob) => {
        if (prob.id !== id) return prob;
        const nextStatus: ProblemItem["status"] =
          prob.status === "NOT_STARTED"
            ? "IN_PROGRESS"
            : prob.status === "IN_PROGRESS"
            ? "SOLVED"
            : "NOT_STARTED";
        return { ...prob, status: nextStatus };
      })
    );
  };

  const handleToggleBookmark = (id: number) => {
    setProblemsList((prev) =>
      prev.map((prob) =>
        prob.id === id ? { ...prob, isBookmarked: !prob.isBookmarked } : prob
      )
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProblem: ProblemItem = {
      id: Date.now(),
      title: newTitle.trim(),
      topic: newTopic,
      difficulty: newDifficulty,
      link: newLink.trim() || undefined,
      status: "NOT_STARTED",
    };

    setProblemsList((prev) => [newProblem, ...prev]);

    // Reset inputs
    setNewTitle("");
    setNewLink("");
    setIsAddModalOpen(false);
  };

  const filteredProblems = problemsList
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === "ALL" || item.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesTopic = selectedTopic === "ALL" || item.topic === selectedTopic;
      return matchesSearch && matchesDifficulty && matchesStatus && matchesTopic;
    })
    .sort((a, b) => {
      if (sortBy === "TITLE") return a.title.localeCompare(b.title);
      if (sortBy === "DIFFICULTY") {
        const order = { EASY: 1, MEDIUM: 2, HARD: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage) || 1;
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isFilterActive = searchQuery || difficultyFilter !== "ALL" || statusFilter !== "ALL" || selectedTopic !== "ALL" || sortBy !== "DEFAULT";

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-3 sm:p-6 md:p-10 font-sans space-y-6 sm:space-y-8 relative">
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
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 text-center"
            >
              + New Problem Entry
            </button>
          </div>
        </header>

        {/* Quick Stats Grid Header */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <p className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase">Total Listed</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{problemsList.length}</h3>
          </div>
          <div className="p-4 sm:p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <p className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase">Solved</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {problemsList.filter((p) => p.status === "SOLVED").length}
            </h3>
          </div>
          <div className="p-4 sm:p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <p className="text-[10px] sm:text-xs font-semibold text-sky-400 uppercase">In Progress</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {problemsList.filter((p) => p.status === "IN_PROGRESS").length}
            </h3>
          </div>
          <div className="p-4 sm:p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <p className="text-[10px] sm:text-xs font-semibold text-rose-400 uppercase">Hard Mastered</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {problemsList.filter((p) => p.difficulty === "HARD" && p.status === "SOLVED").length}
            </h3>
          </div>
        </div>

        {/* Topic Quick Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {topicCategories.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedTopic === topic
                  ? "bg-amber-500 text-zinc-950 font-bold"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
              }`}
            >
              {topic === "ALL" ? "All Topics" : topic}
            </button>
          ))}
        </div>

        {/* Search & Topic Filter Controls */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem name or topic..."
                className="w-full pl-4 pr-12 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
              />
              <kbd className="absolute right-3 hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 rounded pointer-events-none">
                /
              </kbd>
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

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-44 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-amber-500/60"
            >
              <option value="DEFAULT">Sort By: Default</option>
              <option value="TITLE">Sort By: Title</option>
              <option value="DIFFICULTY">Sort By: Difficulty</option>
            </select>
          </div>

          {/* Difficulty Tier Buttons & Reset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 text-xs">
            <div className="flex items-center gap-2">
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

            {isFilterActive && (
              <button
                onClick={resetAllFilters}
                className="text-amber-400 hover:text-amber-300 text-xs underline font-medium"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Problems Table View Header */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">Problem List Catalogue</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono bg-zinc-800 text-amber-400 rounded-full border border-zinc-700">
                {filteredProblems.length} {filteredProblems.length === 1 ? "problem" : "problems"} found
              </span>
            </div>
            {isFilterActive && (
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline-block">
                Filtered from {problemsList.length} total entries
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
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
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6"><div className="h-4 bg-zinc-800 rounded w-48"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-zinc-800 rounded w-16"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                      <td className="py-4 px-6 text-right"><div className="h-4 bg-zinc-800 rounded w-12 ml-auto"></div></td>
                    </tr>
                  ))
                ) : paginatedProblems.length > 0 ? (
                  paginatedProblems.map((prob) => (
                    <tr key={prob.id} className="hover:bg-zinc-800/40 transition-all">
                      <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBookmark(prob.id)}
                          className={`text-lg transition-transform active:scale-125 ${
                            prob.isBookmarked ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"
                          }`}
                          title="Toggle Favorite Bookmark"
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
                        <button
                          onClick={() => handleToggleStatus(prob.id)}
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all cursor-pointer ${getStatusBadgeStyle(prob.status)}`}
                        >
                          {prob.status.replace("_", " ")}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedProblemDrawer(prob)}
                          className="text-xs text-zinc-400 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700"
                        >
                          View Notes
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500 text-sm">
                      No matching problems found. Try adjusting your search query or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          <div className="p-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <div>
              Showing {filteredProblems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of {filteredProblems.length} entries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-2 font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Problem Notes Drawer Panel */}
      {selectedProblemDrawer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-lg p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-xl font-bold text-white">{selectedProblemDrawer.title}</h3>
              <button
                onClick={() => setSelectedProblemDrawer(null)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">Topic & Difficulty</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2.5 py-1 bg-zinc-800 rounded-md text-zinc-300">
                    {selectedProblemDrawer.topic}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getDifficultyColor(selectedProblemDrawer.difficulty)}`}>
                    {selectedProblemDrawer.difficulty}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">Complexity Analysis</p>
                <p className="text-sm font-mono text-amber-400 mt-1">
                  Time: {selectedProblemDrawer.timeComplexity || "O(N)"} | Space: {selectedProblemDrawer.spaceComplexity || "O(1)"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">Key Notes & Intuition</p>
                <p className="text-sm text-zinc-300 mt-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono whitespace-pre-wrap">
                  {selectedProblemDrawer.notes || "No custom notes recorded for this problem yet."}
                </p>
              </div>

              {selectedProblemDrawer.codeSnippet && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase">Saved Solution Snippet</p>
                  <pre className="text-xs text-emerald-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono overflow-x-auto mt-1">
                    <code>{selectedProblemDrawer.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Problem Modal Window */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">Add Problem to Catalogue</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Problem Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 53. Maximum Subarray"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Category Topic
                </label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
                >
                  {topicCategories.filter((c) => c !== "ALL").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Difficulty
                </label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Problem Link URL
                </label>
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl"
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

// Solution Code Modal Helper
export const CodePreviewModal = ({ code, isOpen, onClose }: { code: string; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Solution Code</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">✕</button>
        </div>
        <pre className="bg-zinc-950 p-4 rounded-xl text-xs text-emerald-400 font-mono overflow-x-auto max-h-96 border border-zinc-800/60">{code || '// No code submitted yet'}</pre>
      </div>
    </div>
  );
};

// Syntax Theme Config
export const syntaxThemes = ['emerald-dark', 'github-dark', 'one-dark-pro', 'monokai'];

// Copy to clipboard helper
export const copySnippetToClipboard = async (text: string) => {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
};

// Runtime & Memory Percentile Helper
export const formatPercentileTag = (percentile?: number) => {
  if (!percentile) return 'Beats --%';
  return `Beats ${percentile.toFixed(1)}%`;
};

// Space Complexity Badge Helper
export const getSpaceBadge = (space?: string) => {
  return space ? `O(${space})` : 'O(1)';
};

// Time Complexity Pill Indicator
export const getTimeBadge = (time?: string) => {
  return time ? `O(${time})` : 'O(N)';
};

// LeetCode Redirect Formatter
export const getLeetCodeUrl = (slug: string) => `https://leetcode.com/problems/${slug}/`;

// Inline Notes Component Interface
export interface ProblemNoteState {
  problemId: number;
  notes: string;
  isSaving: boolean;
}

// Auto-save debounce notification
export const noteSaveIndicator = { saved: 'Saved to cloud', saving: 'Saving...', error: 'Save failed' };

// Bookmark Toggle Persistence Helper
export const toggleProblemBookmark = (problems: ProblemItem[], id: number): ProblemItem[] => {
  return problems.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p);
};

// Bookmarked Filter Predicate
export const filterBookmarkedOnly = (problems: ProblemItem[], onlyBookmarked: boolean) => {
  if (!onlyBookmarked) return problems;
  return problems.filter(p => p.isBookmarked);
};

// Status Cycle Helper: NOT_STARTED -> IN_PROGRESS -> SOLVED
export const getNextProblemStatus = (current: string): 'NOT_STARTED' | 'IN_PROGRESS' | 'SOLVED' => {
  if (current === 'NOT_STARTED') return 'IN_PROGRESS';
  if (current === 'IN_PROGRESS') return 'SOLVED';
  return 'NOT_STARTED';
};

// Progress Summary Calculation
export const calculateSolvedStats = (list: ProblemItem[]) => {
  const total = list.length || 1;
  const solved = list.filter(p => p.status === 'SOLVED').length;
  return { solved, total, percentage: Math.round((solved / total) * 100) };
};

// Topic Filter Pills List
export const defaultTopicTags = ['All', 'Arrays', 'Strings', 'Two Pointers', 'Sliding Window', 'Stack', 'Trees', 'Graphs', 'DP'];

// Difficulty Tier Distribution Helper
export const getDifficultyDistribution = (list: ProblemItem[]) => ({
  easy: list.filter(p => p.difficulty === 'EASY').length,
  medium: list.filter(p => p.difficulty === 'MEDIUM').length,
  hard: list.filter(p => p.difficulty === 'HARD').length
});

// Search query debounce timeout constant
export const SEARCH_DEBOUNCE_DELAY_MS = 300;

// Column Sorting Type
export type ProblemSortField = 'id' | 'title' | 'difficulty' | 'status';
export type ProblemSortDirection = 'asc' | 'desc';

// Pagination Page Size Options
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Empty State Placeholder Component
export const EmptyProblemsPlaceholder = () => (
  <div className="text-center py-16 text-zinc-500 font-medium">
    <p className="text-lg text-zinc-400">No matching problems found.</p>
    <p className="text-xs mt-1 text-zinc-600">Try adjusting your filter search parameters.</p>
  </div>
);

// Export to JSON Utility
export const exportProblemsToJson = (items: ProblemItem[]) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `leetcode-tracker-export-${Date.now()}.json`);
  a.click();
};

// Export to Markdown Table Utility
export const exportProblemsToMarkdown = (items: ProblemItem[]) => {
  const header = '| # | Title | Difficulty | Topic | Status |\n|---|---|---|---|---|\n';
  const rows = items.map(p => `| ${p.id} | ${p.title} | ${p.difficulty} | ${p.topic} | ${p.status} |`).join('\n');
  return header + rows;
};

// Bulk Status Updater Function
export const bulkUpdateStatus = (items: ProblemItem[], ids: number[], status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SOLVED') => {
  return items.map(item => ids.includes(item.id) ? { ...item, status } : item);
};
