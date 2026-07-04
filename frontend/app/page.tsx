import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <main className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 py-8 flex-wrap">
        <Card title="Demand Forecasting" description="AI-based demand prediction for local products and services." />
        <Card title="Price Prediction" description="Smart price prediction using historical and seasonal market trends." />
      </main>
      <Footer />
    </div>
  );
}
