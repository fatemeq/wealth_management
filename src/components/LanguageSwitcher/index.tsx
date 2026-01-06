import React, { useEffect, useState } from "react";
import { Card, Button, Space, Typography } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useLanguage } from "~/contexts/LanguageContext";

const { Title } = Typography;

const LanguageSwitcher: React.FC = () => {
  const [visible, setVisible] = useState(() => !localStorage.getItem("languageSwitcherSeen"));
  const { setLanguage } = useLanguage();

  if (!visible) return null;

  const handleLanguageSelect = (lang: "en" | "fa") => {
    setLanguage(lang);
    localStorage.setItem("languageSwitcherSeen", "true");
    setVisible(false);
  };

  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      background: "rgba(0,0,0,.8)",
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Card style={{ 
        maxWidth: 400, 
        width: "90vw",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <GlobalOutlined style={{ fontSize: 64, marginBottom: 24, color: "#1890ff" }} />
        <Title level={3} style={{ marginBottom: 32 }}>
          Choose Language
        </Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button 
            block 
            size="large"
            onClick={() => handleLanguageSelect("en")}
            style={{ height: 56, fontSize: 18 }}
          >
            🇺🇸 English
          </Button>
          <Button 
            block 
            size="large"
            onClick={() => handleLanguageSelect("fa")}
            style={{ height: 56, fontSize: 18 }}
          >
            🇮🇷 فارسی
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default LanguageSwitcher;
