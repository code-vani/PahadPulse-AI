export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 px-4 text-center">
      {/* Topographic contour signature */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 800 300" preserveAspectRatio="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M0 ${220 - i * 25} Q 200 ${140 - i * 25} 400 ${180 - i * 25} T 800 ${160 - i * 25}`}
            fill="none"
            stroke="#1F4D3C"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="relative">
        <span className="inline-block bg-accent/15 text-clay text-xs font-semibold tracking-wide px-3 py-1 rounded-full mb-5">
          MARKET INTELLIGENCE FOR THE HILLS
        </span>
        <h2 className="text-4xl sm:text-6xl font-display font-semibold text-brand leading-tight max-w-3xl mx-auto">
          Know your market before you sell.
        </h2>
        <p className="mt-5 text-base sm:text-lg text-foreground/70 max-w-xl mx-auto">
          AI-driven demand forecasts, price predictions, and selling advice for
          Uttarakhand&rsquo;s farmers and artisans — in plain Hindi or English.
        </p>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <a href="/dashboard" className="bg-brand text-background px-6 py-3 rounded-full font-semibold hover:bg-brand/90 transition-colors">
            View Forecasts
          </a>
          <a href="/about" className="border border-brand/30 text-brand px-6 py-3 rounded-full font-semibold hover:bg-brand/5 transition-colors">
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}