"use client";
import { useState } from "react";
import { authFetch } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

interface ForecastInput {
  product: string;
  market: string;
  demand_score: number;
  predicted_price: number;
}

export default function AIAdvisor({ forecast }: { forecast: ForecastInput }) {
  const { lang, t } = useLanguage();
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
        body: JSON.stringify({ ...forecast, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to get recommendation");
      setResult(data.recommendation);
    } catch (err: any) {
      setError(err.message || t("ai_error"));
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
        {loading ? t("btn_analyzing") : t("btn_ai")}
      </button>

      {loading && (
        <p className="text-muted text-sm mt-2">{t("msg_analyzing")}</p>
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
