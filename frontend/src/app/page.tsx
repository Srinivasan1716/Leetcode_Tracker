"use client";

import { useEffect, useState } from "react";

interface Dashboard {
  totalProblems: number;
  solved: number;
  inProgress: number;
  notStarted: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export default function Home() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard/1"
        );

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

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            LeetCode Tracker Web.........
          </h1>

          <p className="text-zinc-400 mt-2">
            Track your coding progress and improve every day.
          </p>
        </div>

        {loading ? (
          <p className="text-zinc-400">
            Loading dashboard
          </p>
        ) : dashboard ? (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <p className="text-zinc-400">
                  Total Problems.. ...
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {dashboard.totalProblems}
                </h2>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <p className="text-zinc-400">
                  Solved
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {dashboard.solved}
                </h2>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <p className="text-zinc-400">
                  In Progress
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {dashboard.inProgress}
                </h2>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <p className="text-zinc-400">
                  Not Started
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {dashboard.notStarted}
                </h2>
              </div>

            </div>

            {/* Difficulty */}
            <div className="mt-8">

              <h2 className="text-2xl font-semibold mb-4">
                Solved by Difficulty
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <p className="text-zinc-400">
                    Easy
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {dashboard.easySolved}
                  </h2>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <p className="text-zinc-400">
                    Medium
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {dashboard.mediumSolved}
                  </h2>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <p className="text-zinc-400">
                    Hard
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {dashboard.hardSolved}
                  </h2>
                </div>

              </div>

            </div>

          </>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <p className="text-red-400">
              Unable to load dashboard.
            </p>

            <p className="text-zinc-400 mt-2">
              Make sure the backend is running on port 5000.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}