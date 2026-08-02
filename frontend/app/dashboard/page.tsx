"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { Loader, Toast } from "@/components/ui";
import { logoutUser, authFetch } from "@/lib/auth";
import AIAdvisor from "@/components/AIAdvisor";

interface Forecast {
  id: string;
  product: string;
  market: string;
  demand_score: number;
  predicted_price: number;
}

const emptyForm = { product: "", market: "", demand_score: "", predicted_price: "" };

export default function Dashboard() {
  const router = useRouter();
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Forecast | null>(null);

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  function loadForecasts() {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forecasts`)
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
  }

  useEffect(() => {
  loadForecasts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(f: Forecast) {
    setForm({
      product: f.product,
      market: f.market,
      demand_score: String(f.demand_score),
      predicted_price: String(f.predicted_price),
    });
    setEditingId(f.id);
    setFormError("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.product.trim() || !form.market.trim()) {
      setFormError("Product and market are required.");
      return;
    }
    const demand = Number(form.demand_score);
    const price = Number(form.predicted_price);
    if (isNaN(demand) || demand < 0 || demand > 100) {
      setFormError("Demand score must be a number between 0 and 100.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      setFormError("Predicted price must be a positive number.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        product: form.product.trim(),
        market: form.market.trim(),
        demand_score: demand,
        predicted_price: price,
      };
      const url = editingId ? `/api/forecasts/${editingId}` : `/api/forecasts`;
      const res = await authFetch(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Save failed");
      }
      setShowForm(false);
      loadForecasts();
    } catch (err: unknown) {
  const message = err instanceof Error ? err.message : "Something went wrong.";
  setFormError(message);
} finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await authFetch(`/api/forecasts/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setForecasts((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    } catch {
      setError("Could not delete forecast. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <main className="flex-1 px-4 sm:px-8 py-10 max-w-5xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
            <h1 className="text-3xl font-bold text-green-700">Dashboard</h1>
            <div className="flex gap-2">
              <button onClick={openCreateForm} className="bg-brand text-background text-sm font-semibold px-4 py-2 rounded-full">
                + New Forecast
              </button>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-1.5">
                Logout
              </button>
            </div>
          </div>
          <p className="text-gray-500 mb-8">Live demand forecasts from the backend</p>

          {loading && (
            <div className="flex items-center gap-3 text-gray-500 py-10">
              <Loader size="md" />
              <span>Loading forecasts...</span>
            </div>
          )}

          {!loading && !error && forecasts.length === 0 && (
            <EmptyState message="No forecasts yet — add your first one." actionLabel="+ New Forecast" onAction={openCreateForm} />
          )}

          {!loading && !error && forecasts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {forecasts.map((f) => (
                <div key={f.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="font-semibold text-green-700">{f.product}</h2>
                    <div className="flex gap-2 text-xs">
                      <button onClick={() => openEditForm(f)} className="text-brand underline">Edit</button>
                      <button onClick={() => setDeleteTarget(f)} className="text-clay underline">Delete</button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Market: {f.market}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Demand Score: <span className="font-medium">{f.demand_score}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Predicted Price: <span className="font-medium">₹{f.predicted_price}</span>
                  </p>
                  <AIAdvisor
                    forecast={{
                      product: f.product,
                      market: f.market,
                      demand_score: f.demand_score,
                      predicted_price: f.predicted_price,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-3">
              <h3 className="font-display font-semibold text-lg text-brand">
                {editingId ? "Edit Forecast" : "New Forecast"}
              </h3>
              <input placeholder="Product" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Market" value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Demand Score (0-100)" value={form.demand_score} onChange={(e) => setForm({ ...form, demand_score: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Predicted Price (₹)" value={form.predicted_price} onChange={(e) => setForm({ ...form, predicted_price: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex gap-3 justify-end mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-full text-sm border border-brand/20 text-brand">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-full text-sm bg-brand text-background font-semibold disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete forecast?"
          message={`This will permanently delete "${deleteTarget?.product}". This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        <Toast message={error} type="error" show={!!error} />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}