"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logoutUser } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export default function Navbar() {
  const router = useRouter();
  const { lang, toggleLang, t } = useLanguage();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  function handleLogout() {
    logoutUser();
    setLoggedIn(false);
    router.push("/login");
  }

  return (
    <nav className="w-full bg-background/90 backdrop-blur border-b border-brand/10 px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-2 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 20L9 8L14 15L18 9L26 20" stroke="#1F4D3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="18" cy="9" r="2" fill="#D99A2B"/>
        </svg>
        <h1 className="text-xl font-display font-semibold text-brand">PahadPulse <span className="text-accent">AI</span></h1>
      </div>
      <div className="flex gap-6 text-sm font-medium text-foreground/80">
        <a href="/" className="hover:text-brand transition-colors">{t("nav_home")}</a>
        <a href="/about" className="hover:text-brand transition-colors">{t("nav_about")}</a>
        <a href="/dashboard" className="hover:text-brand transition-colors">{t("nav_dashboard")}</a>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="text-xs font-semibold border border-brand/30 text-brand rounded-full px-3 py-1.5 hover:bg-brand/5"
        >
          {lang === "en" ? "हिं" : "EN"}
        </button>
        {loggedIn ? (
          <button onClick={handleLogout} className="bg-brand text-background px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand/90 transition-colors">
            {t("nav_logout")}
          </button>
        ) : (
          <a href="/login" className="bg-brand text-background px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand/90 transition-colors">
            {t("nav_login")}
          </a>
        )}
      </div>
    </nav>
  );
}
