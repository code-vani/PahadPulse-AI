import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/Card";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="flex-1 px-4 sm:px-8 py-10 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-8">Your market insights at a glance</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card title="Total Forecasts" description="128 demand forecasts generated this month." />
          <Card title="Active Markets" description="14 local markets being tracked in real time." />
          <Card title="Avg. Price Accuracy" description="92% prediction accuracy across products." />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Demand Trend (Placeholder)</h2>
          <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
            Chart will go here
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
