import { NavLink } from "react-router-dom";
import translate from "translate";
import { useEffect, useState } from "react";
import {
  Mailbox,
  LayoutDashboard,
  Pencil,
  Podcast,
  UserRound,
  List,
  ListX,
  LogOut,
} from "lucide-react";
import NormalHeadNoLinks from "./NormalHeadNoLinks";

// eslint-disable-next-line react/prop-types
export default function Mainsidebar({ menufunction, menustate, pagename }) {
  const [language, setLanguage] = useState("en");

  const supportedLanguages = [
    { code: "en", name: "English" },
    { code: "ig", name: "Igbo" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ru", name: "Русский" },
    { code: "ar", name: "العربية" },
    { code: "hi", name: "हिन्दी" },
    { code: "pt", name: "Português" },
    { code: "tr", name: "Türkçe" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "pl", name: "Polski" },
    { code: "nl", name: "Nederlands" },
    { code: "ko", name: "한국어" },
  ];

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (
      storedLanguage &&
      supportedLanguages.find((lang) => lang.code === storedLanguage)
    ) {
      setLanguage(storedLanguage);
      translatePage(storedLanguage);
    } else {
      const userLang = navigator.language.split("-")[0];
      if (supportedLanguages.find((lang) => lang.code === userLang)) {
        setLanguage(userLang);
        translatePage(userLang);
      }
    }
  }, []);

  const translatePage = async (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    translate.engine = "google";

    const elements = document.querySelectorAll("body *");

    for (let element of elements) {
      if (
        element.children.length === 0 &&
        element.innerText &&
        element.innerText.trim() !== ""
      ) {
        try {
          const translatedText = await translate(element.innerText, lang);
          element.innerText = translatedText;
        } catch (error) {
          console.error("Translation error:", error);
        }
      }
    }
  };

  return (
    <div className="h-screen w-fit fixed top-0 left-0 shadow-xl bg-background2">
      <div className="flex flex-col h-full p-4 w-60">
        <div className="space-y-4">
          <NormalHeadNoLinks />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold capitalize">{pagename}</h2>
            <div className="sm:hidden">
              <button onClick={menufunction}>
                {menustate ? <ListX /> : <List />}
              </button>
            </div>
          </div>
          <nav className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              {[
                { to: "/dashboard", icon: LayoutDashboard, label: "dashboard" },
                { to: "/dashboard/create", icon: Pencil, label: "create" },
                { to: "/dashboard/posts", icon: Mailbox, label: "posts" },
                {
                  to: "/dashboard/subscription",
                  icon: Podcast,
                  label: "subscription",
                },
                {
                  to: "/dashboard/profile",
                  icon: UserRound,
                  label: "profile",
                },
                { to: "/", icon: LogOut, label: "logout" },
              ].map(({ to, icon: Icon, label }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    end={to === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-400 hover:font-semibold hover:bg-accent/50 ${
                        isActive ? "bg-accent font-semibold" : ""
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="capitalize">{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          <label
            htmlFor="language-select"
            className="block text-xs mb-1 text-muted-foreground"
          >
            Choose a language:
          </label>
          <select
            id="language-select"
            className="w-full text-sm p-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            value={language}
            onChange={(e) => translatePage(e.target.value)}
          >
            {supportedLanguages.map((lang, index) => (
              <option key={index} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
