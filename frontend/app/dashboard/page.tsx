"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader, Toast } from "@/components/ui";

interface Forecast {
  id: number;
  product: string;
  market: string;
  demand_score: number;
  predicted_price: number;
}

export default function Dashboard() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/forecasts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch forecasts");
        return res.json();
      })
      .then((data) => {
        setForecasts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load forecasts. Is the backend running?");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="flex-1 px-4 sm:px-8 py-10 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-8">Live demand forecasts from the backend</p>

        {loading && (
          <div className="flex items-center gap-3 text-gray-500 py-10">
            <Loader size="md" />
            <span>Loading forecasts...</span>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {forecasts.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="font-semibold text-green-700">{f.product}</h2>
                <p className="text-sm text-gray-500 mt-1">Market: {f.market}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Demand Score: <span className="font-medium">{f.demand_score}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Predicted Price: <span className="font-medium">₹{f.predicted_price}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Toast message={error} type="error" show={!!error} />
      <Footer />
    </div>
  );
}
