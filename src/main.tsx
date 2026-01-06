import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { I18nextProvider } from "react-i18next";

import App from "./App";
import i18n from "./i18n";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

import faIR from "antd/locale/fa_IR";
import enUS from "antd/locale/en_US";

// ✅ Wrap ConfigProvider inside a component that consumes LanguageContext
const AntdWrapper: React.FC = () => {
  const { language } = useLanguage();

  return (
    <ConfigProvider
      locale={language === "fa" ? faIR : enUS}
      direction={language === "fa" ? "rtl" : "ltr"}
    >
      <App />
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <BrowserRouter>
          <AntdWrapper />
        </BrowserRouter>
      </LanguageProvider>
    </I18nextProvider>
  </React.StrictMode>
);
