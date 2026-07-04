import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-green-700">About Us</h1>
        <p className="mt-4 text-gray-600">
          Learn more about PahadPulse AI and our mission to empower Uttarakhand&apos;s farmers, artisans, and local businesses through data-driven insights.
        </p>
      </main>
      <Footer />
    </div>
  );
}
