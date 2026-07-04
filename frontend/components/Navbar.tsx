export default function Navbar() {
  return (
    <nav className="w-full bg-green-700 text-white px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-2">
      <h1 className="text-xl font-bold">PahadPulse AI</h1>
      <div className="flex gap-4 text-sm sm:text-base">
        <a href="/" className="hover:underline">Home</a>
        <a href="/about" className="hover:underline">About</a>
        <a href="/dashboard" className="hover:underline">Dashboard</a>
        <a href="/login" className="hover:underline">Login</a>
      </div>
    </nav>
  );
}
