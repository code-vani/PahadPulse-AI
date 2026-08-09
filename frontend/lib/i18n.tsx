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

    about_badge: "OUR MISSION",
    about_title: "Market intelligence for the mountains.",
    about_intro: "PahadPulse AI is an AI-powered market intelligence and demand forecasting platform built for farmers, artisans, and small business owners across Uttarakhand.",

    about_problem_title: "The Problem",
    about_problem_body: "Producers across the mountains — from apple growers in Mussoorie to wool artisans in Munsiyari — rarely have visibility into market demand or fair pricing. That information gap is usually filled by intermediaries, who capture much of the value the producers create.",
    about_solution_title: "What We Do",
    about_solution_body: "PahadPulse AI gives users a simple demand and price estimate for their product and market, along with a plain-language AI recommendation on whether to sell now, what price to expect, and one practical tip — all without needing a business background.",
    about_notmarket_title: "Not a Marketplace",
    about_notmarket_body: "PahadPulse AI does not process payments or connect buyers to sellers. It provides decision support — intelligence, not transactions — so producers can make informed choices on their own terms.",

    how_badge: "HOW IT WORKS",
    how_title: "Three simple steps.",
    how_step1_title: "Tell us what you're selling",
    how_step1_body: "Enter your product and the local market you sell in — e.g. Apples in Mussoorie, or Pashmina Shawls in Almora.",
    how_step2_title: "Get an instant estimate",
    how_step2_body: "We calculate a demand score and predicted price for that product and market, factoring in seasonal patterns.",
    how_step3_title: "Get AI-backed advice",
    how_step3_body: "Our AI advisor turns the numbers into a short, practical recommendation — sell now or wait, expected price, and one actionable tip.",

    stat1_num: "100%", stat1_label: "Free to use",
    stat2_num: "AI", stat2_label: "Powered recommendations",
    stat3_num: "0", stat3_label: "Middlemen involved",
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

    about_badge: "हमारा उद्देश्य",
    about_title: "पहाड़ों के लिए बाज़ार जानकारी।",
    about_intro: "PahadPulse AI उत्तराखंड के किसानों, कारीगरों और छोटे व्यापारियों के लिए बनाया गया एक एआई-आधारित बाज़ार जानकारी और मांग पूर्वानुमान प्लेटफ़ॉर्म है।",

    about_problem_title: "समस्या",
    about_problem_body: "मसूरी के सेब उत्पादकों से लेकर मुनस्यारी के ऊन कारीगरों तक — पहाड़ों के उत्पादकों को अक्सर बाज़ार की मांग या उचित मूल्य की जानकारी नहीं मिलती। यह जानकारी का अंतर आमतौर पर बिचौलिए भरते हैं, जो उत्पादकों द्वारा बनाए गए अधिकांश मूल्य को अपने पास रख लेते हैं।",
    about_solution_title: "हम क्या करते हैं",
    about_solution_body: "PahadPulse AI उपयोगकर्ताओं को उनके उत्पाद और बाज़ार के लिए एक सरल मांग और मूल्य अनुमान देता है, साथ ही एक सरल भाषा में एआई सिफारिश भी देता है — कि अभी बेचें या नहीं, क्या कीमत मिलेगी, और एक व्यावहारिक सुझाव — बिना किसी व्यावसायिक पृष्ठभूमि की आवश्यकता के।",
    about_notmarket_title: "यह कोई मार्केटप्लेस नहीं है",
    about_notmarket_body: "PahadPulse AI कोई भुगतान संसाधित नहीं करता या खरीदारों को विक्रेताओं से नहीं जोड़ता। यह केवल निर्णय-सहायता — जानकारी, न कि लेन-देन — प्रदान करता है, ताकि उत्पादक अपनी शर्तों पर सूचित निर्णय ले सकें।",

    how_badge: "यह कैसे काम करता है",
    how_title: "तीन आसान चरण।",
    how_step1_title: "बताएं आप क्या बेच रहे हैं",
    how_step1_body: "अपना उत्पाद और वह स्थानीय बाज़ार दर्ज करें जहाँ आप बेचते हैं — जैसे मसूरी में सेब, या अल्मोड़ा में पश्मीना शॉल।",
    how_step2_title: "तुरंत अनुमान पाएं",
    how_step2_body: "हम उस उत्पाद और बाज़ार के लिए मांग स्कोर और अनुमानित मूल्य निकालते हैं, मौसमी रुझानों को ध्यान में रखते हुए।",
    how_step3_title: "एआई सलाह पाएं",
    how_step3_body: "हमारा एआई सलाहकार संख्याओं को एक छोटी, व्यावहारिक सिफारिश में बदलता है — अभी बेचें या रुकें, अपेक्षित मूल्य, और एक कार्यशील सुझाव।",

    stat1_num: "100%", stat1_label: "उपयोग करने के लिए मुफ़्त",
    stat2_num: "एआई", stat2_label: "संचालित सिफारिशें",
    stat3_num: "0", stat3_label: "कोई बिचौलिया नहीं",
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
