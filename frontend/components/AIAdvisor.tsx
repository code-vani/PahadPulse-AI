"use client";
import { useState } from "react";
import { authFetch } from "@/lib/auth";

interface ForecastInput {
  product: string;
  market: string;
  demand_score: number;
  predicted_price: number;
}

export default function AIAdvisor({ forecast }: { forecast: ForecastInput }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function getAdvice() {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await authFetch("/api/ai/recommend", {
        method: "POST",
        body: JSON.stringify(forecast),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to get recommendation");
      setResult(data.recommendation);
    } catch (err: any) {
      setError(err.message || "AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        onClick={getAdvice}
        disabled={loading}
        className="bg-brand text-background px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Get AI Recommendation"}
      </button>

      {loading && (
        <p className="text-muted text-sm mt-2">Analyzing market data…</p>
      )}
      {error && (
        <p className="text-clay text-sm mt-2 bg-clay/10 px-3 py-2 rounded-lg">{error}</p>
      )}
      {result && (
        <p className="bg-accent/10 border border-accent/20 p-3 rounded-lg mt-2 text-sm text-foreground">
          {result}
        </p>
      )}
    </div>
  );
}