import React, { ReactNode, useState } from "react";
import { Layout, Typography, Avatar, Button, Select, Card, Grid } from "antd";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { useLanguage } from "~/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const { Content, Header } = Layout;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { language, setLanguage } = useLanguage();
  const isRtl = language === "fa";
  const [collapsed, setCollapsed] = useState(true);

  const renderSidebar = () => (
    <div 
      style={{
        width: 260,
        position: "fixed",
        top: 0,
        height: "100vh",
        background: "#001529",
        zIndex: 999,
        // THIS MAKES IT MOVE: LEFT for EN, RIGHT for FA
        left: isRtl ? "auto" : 0,
        right: isRtl ? 0 : "auto",
        transition: "left 0.3s ease, right 0.3s ease"
      }}
    >
      <Card 
        style={{ 
          margin: 16, 
          borderRadius: 12, 
          background: "rgba(255,255,255,0.1)", 
          textAlign: "center",
          boxShadow: "none",
          border: "none"
        }}
      >
        <Avatar size={64} icon={<UserOutlined />} />
        <Typography.Title level={4} style={{ color: "white", marginTop: 12 }}>
          {t("app.wealthflow")}
        </Typography.Title>
        <Typography.Text style={{ color: "white", opacity: 0.8 }}>
          {t("app.smartAsset")}
        </Typography.Text>
      </Card>
      <div style={{ marginTop: "20px" }}>
        <Sidebar isRtl={isRtl} />
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && !collapsed && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 1001, 
          display: "flex", 
          flexDirection: isRtl ? "row-reverse" : "row" 
        }}>
          {renderSidebar()}
          <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} onClick={() => setCollapsed(true)} />
        </div>
      )}

      {/* DESKTOP SIDEBAR - ALWAYS VISIBLE, MOVES POSITION */}
      {!isMobile && renderSidebar()}

      {/* MAIN CONTENT - WITH PROPER MARGIN FOR SIDEBAR */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginLeft: !isMobile && !isRtl ? 260 : 0,
        marginRight: !isMobile && isRtl ? 260 : 0,
        transition: "margin-left 0.3s ease, margin-right 0.3s ease"
      }}>
        <Header style={{ 
          background: "#fff", 
          padding: "0 24px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: isRtl ? "flex-start" : "flex-end"
        }}>
          {isMobile && (
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={() => setCollapsed(c => !c)} 
              style={{ marginRight: isRtl ? 0 : 16, marginLeft: isRtl ? 16 : 0 }}
            />
          )}
          <Select 
            value={language} 
            size="small" 
            onChange={(v) => setLanguage(v as "en" | "fa")}
            style={{ width: 80 }}
          >
            <Option value="en">EN</Option>
            <Option value="fa">FA</Option>
          </Select>
        </Header>

        <Content style={{ 
          margin: 16, 
          padding: 24, 
          flex: 1,
          minHeight: "calc(100vh - 64px)"
        }}>
          {children || <Outlet />}
        </Content>
      </div>
    </>
  );
};

export default DashboardLayout;
