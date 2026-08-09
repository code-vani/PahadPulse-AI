"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";

export default function About() {
  const { t } = useLanguage();

  const steps = [
    { n: "1", title: t("how_step1_title"), body: t("how_step1_body") },
    { n: "2", title: t("how_step2_title"), body: t("how_step2_body") },
    { n: "3", title: t("how_step3_title"), body: t("how_step3_body") },
  ];

  const stats = [
    { num: t("stat1_num"), label: t("stat1_label") },
    { num: t("stat2_num"), label: t("stat2_label") },
    { num: t("stat3_num"), label: t("stat3_label") },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden py-20 px-4 text-center">
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 800 300" preserveAspectRatio="none">
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={"M0 " + (220 - i * 25) + " Q 200 " + (140 - i * 25) + " 400 " + (180 - i * 25) + " T 800 " + (160 - i * 25)} fill="none" stroke="#1F4D3C" strokeWidth="2" />
          ))}
        </svg>
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-block bg-accent/15 text-clay text-xs font-semibold tracking-wide px-3 py-1 rounded-full mb-5">
            {t("about_badge")}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-semibold text-brand leading-tight">
            {t("about_title")}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-foreground/70">
            {t("about_intro")}
          </p>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center bg-white/60 border border-brand/10 rounded-2xl py-5">
              <div className="text-2xl sm:text-3xl font-display font-semibold text-brand">{s.num}</div>
              <div className="text-xs text-foreground/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-8 items-start">
            <div className="w-8 h-1 bg-clay rounded-full sm:mt-3"></div>
            <div>
              <h2 className="text-2xl font-display font-semibold text-brand mb-2">{t("about_problem_title")}</h2>
              <p className="text-foreground/70 leading-relaxed">{t("about_problem_body")}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-8 items-start">
            <div className="w-8 h-1 bg-accent rounded-full sm:mt-3"></div>
            <div>
              <h2 className="text-2xl font-display font-semibold text-brand mb-2">{t("about_solution_title")}</h2>
              <p className="text-foreground/70 leading-relaxed">{t("about_solution_body")}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-8 items-start">
            <div className="w-8 h-1 bg-brand rounded-full sm:mt-3"></div>
            <div>
              <h2 className="text-2xl font-display font-semibold text-brand mb-2">{t("about_notmarket_title")}</h2>
              <p className="text-foreground/70 leading-relaxed">{t("about_notmarket_body")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-brand/[0.04] border-y border-brand/10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-accent/15 text-clay text-xs font-semibold tracking-wide px-3 py-1 rounded-full mb-4">
            {t("how_badge")}
          </span>
          <h2 className="text-3xl font-display font-semibold text-brand mb-12">{t("how_title")}</h2>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {steps.map((s) => (
              <div key={s.n} className="bg-white rounded-2xl border border-brand/10 shadow-sm p-6 relative">
                <div className="w-10 h-10 rounded-full bg-brand text-background flex items-center justify-center font-display font-semibold text-lg mb-4">
                  {s.n}
                </div>
                <h3 className="font-display font-semibold text-lg text-brand mb-2">{s.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <a href="/dashboard" className="inline-block bg-brand text-background px-8 py-3 rounded-full font-semibold hover:bg-brand/90 transition-colors">{t("hero_cta_primary")}</a>
      </section>

      <Footer />
    </div>
  );
}
