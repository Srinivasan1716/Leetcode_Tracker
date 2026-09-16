"use client";

import React, { useState } from "react";

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

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold">Problems Collection</h1>
        <p className="text-zinc-400 mt-2">Manage and practice your LeetCode problem set.</p>
      </div>
    </main>
  );
}
