"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "en" | "hi";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    nav_home: "Home", nav_about: "About", nav_dashboard: "Dashboard",
    nav_login: "Login", nav_logout: "Logout",
    hero_badge: "MARKET INTELLIGENCE FOR THE HILLS",
    hero_title: "Know your market before you sell.",
    hero_subtitle: "AI-driven demand forecasts, price predictions, and selling advice for Uttarakhand's farmers and artisans.",
    hero_cta_primary: "View Forecasts", hero_cta_secondary: "How it works",
    dash_title: "Dashboard", dash_subtitle: "Live demand forecasts from the backend",
    dash_new_forecast: "+ New Forecast",
    dash_empty: "No forecasts yet — add your first one.",
    label_market: "Market", label_demand: "Demand Score", label_price: "Predicted Price",
    btn_ai: "Get AI Recommendation", btn_edit: "Edit", btn_delete: "Delete",
    btn_analyzing: "Analyzing...", msg_analyzing: "Analyzing market data…",
    ai_error: "AI request failed. Please try again.",
    btn_predict: "Predict Demand & Price", btn_predicting: "Predicting...",
    btn_repredict: "Re-predict", btn_save: "Save", btn_saving: "Saving...", btn_cancel: "Cancel",
    form_title_new: "New Forecast", form_title_edit: "Edit Forecast",
    placeholder_product: "Product", placeholder_market: "Market",
    confirm_delete_title: "Delete forecast?",
  },
  hi: {
    nav_home: "होम", nav_about: "हमारे बारे में", nav_dashboard: "डैशबोर्ड",
    nav_login: "लॉग इन", nav_logout: "लॉग आउट",
    hero_badge: "पहाड़ों के लिए बाज़ार जानकारी",
    hero_title: "बेचने से पहले अपना बाज़ार जानिए।",
    hero_subtitle: "उत्तराखंड के किसानों और कारीगरों के लिए एआई-आधारित मांग पूर्वानुमान, मूल्य भविष्यवाणी और बिक्री सलाह।",
    hero_cta_primary: "पूर्वानुमान देखें", hero_cta_secondary: "यह कैसे काम करता है",
    dash_title: "डैशबोर्ड", dash_subtitle: "बैकएंड से लाइव मांग पूर्वानुमान",
    dash_new_forecast: "+ नया पूर्वानुमान",
    dash_empty: "अभी तक कोई पूर्वानुमान नहीं — अपना पहला जोड़ें।",
    label_market: "बाज़ार", label_demand: "मांग स्कोर", label_price: "अनुमानित मूल्य",
    btn_ai: "एआई सिफारिश पाएं", btn_edit: "संपादित करें", btn_delete: "हटाएं",
    btn_analyzing: "विश्लेषण हो रहा है...", msg_analyzing: "बाज़ार डेटा का विश्लेषण हो रहा है…",
    ai_error: "एआई अनुरोध विफल रहा। कृपया पुनः प्रयास करें।",
    btn_predict: "मांग और मूल्य का अनुमान लगाएं", btn_predicting: "अनुमान लगाया जा रहा है...",
    btn_repredict: "पुनः अनुमान लगाएं", btn_save: "सहेजें", btn_saving: "सहेजा जा रहा है...", btn_cancel: "रद्द करें",
    form_title_new: "नया पूर्वानुमान", form_title_edit: "पूर्वानुमान संपादित करें",
    placeholder_product: "उत्पाद", placeholder_market: "बाज़ार",
    confirm_delete_title: "पूर्वानुमान हटाएं?",
  },
};

interface LangContextType { lang: Lang; toggleLang: () => void; t: (key: string) => string; }
const LangContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("pahadpulse_lang") as Lang | null;
    if (saved === "en" || saved === "hi") setLang(saved);
  }, []);

  function toggleLang() {
    const next: Lang = lang === "en" ? "hi" : "en";
    setLang(next);
    localStorage.setItem("pahadpulse_lang", next);
  }

  function t(key: string) {
    return translations[lang][key] || key;
  }

  return <LangContext.Provider value={{ lang, toggleLang, t }}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
