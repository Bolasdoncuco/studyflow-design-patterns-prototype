"use client";

import { useState } from "react";

type QueryResponse = {
  message: string;
  result: { connectionId: string; queryNumber: number; query: string };
  stats: { connectionId: string; createdAt: string; totalQueries: number };
};

export default function Home() {
  const [query, setQuery] = useState("SELECT * FROM students");
  const [history, setHistory] = useState<QueryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleRunQuery() {
    setLoading(true);
    const res = await fetch(`/api/singleton?q=${encodeURIComponent(query)}`);
    const data: QueryResponse = await res.json();
    setHistory((prev) => [data, ...prev]);
    setLoading(false);
  }

  return (
    <main className="container">
      <h1>🔒 Singleton Pattern — Connection Manager</h1>
      <p className="subtitle">
        Each button click triggers a new request to the server. Notice that{" "}
        <code>connectionId</code> is always the same: it's the SAME instance
        being reused, not a new connection per request.
      </p>

      <div className="panel">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a simulated query..."
        />
        <button onClick={handleRunQuery} disabled={loading}>
          {loading ? "Running..." : "Run query"}
        </button>
      </div>

      <div className="results">
        {history.length === 0 && <p className="empty">No queries have been run yet.</p>}
        {history.map((h, i) => (
          <div className="card" key={i}>
            <p>
              <strong>#{h.result.queryNumber}</strong> — {h.result.query}
            </p>
            <p className="mono">connectionId: {h.result.connectionId}</p>
            <p className="mono">
              created: {h.stats.createdAt} · total queries: {h.stats.totalQueries}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
