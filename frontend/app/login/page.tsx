import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-green-700">Login</h1>
        <p className="mt-4 text-gray-600">
          Login functionality coming soon.
        </p>
      </main>
      <Footer />
    </div>
  );
}
