// DashboardLayout.tsx
import React, { type ReactNode, useState } from "react";
import { Layout, Typography, Avatar, Card, Grid, Button } from "antd";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";

const { Content, Sider, Header } = Layout;
const { useBreakpoint } = Grid;

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md; // < 768px
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          width={260}
          breakpoint="md"
          collapsedWidth={80}
          style={{ position: "sticky", top: 0, height: "100vh" }}
        >
          <Card
            style={{
              margin: "16px",
              borderRadius: 12,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Avatar size={64} icon={<UserOutlined />} />
            <Typography.Title
              level={4}
              style={{ color: "white", marginTop: 12 }}
            >
              WealthFlow
            </Typography.Title>
            <Typography.Text style={{ color: "white", opacity: 0.8 }}>
              Smart Asset Management
            </Typography.Text>
          </Card>

          <Sidebar />
        </Sider>
      )}

      <Layout>
        {/* Only show header on mobile */}
        {isMobile && (
          <Header
            style={{
              background: "#fff",
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            }}
          >
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed((c) => !c)}
            />

            {/* Show title only when sidebar is hidden */}
            {collapsed && (
              <Typography.Title
                level={4}
                style={{
                  margin: 0,
                  fontSize: 18,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                WealthFlow
              </Typography.Title>
            )}

            <div style={{ width: 32 }} />
          </Header>
        )}

        {/* Mobile sidebar overlay (slides from left) */}
        {isMobile && !collapsed && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
            }}
          >
            {/* Sidebar panel (on the left now) */}
            <div
              style={{
                width: 260,
                background: "#001529",
                paddingTop: 16,
                transform: "translateX(0)",
                transition: "transform 0.3s ease-in-out",
                boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Card
                style={{
                  margin: "0 16px 16px",
                  borderRadius: 12,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <Avatar size={64} icon={<UserOutlined />} />
                <Typography.Title
                  level={4}
                  style={{ color: "white", marginTop: 12 }}
                >
                  WealthFlow
                </Typography.Title>
                <Typography.Text style={{ color: "white", opacity: 0.8 }}>
                  Smart Asset Management
                </Typography.Text>
              </Card>

              <Sidebar />
            </div>

            {/* Clickable dark overlay */}
            <div
              style={{ flex: 1, background: "rgba(0,0,0,0.45)" }}
              onClick={() => setCollapsed(true)}
            />
          </div>
        )}

        <Content style={{ margin: "16px" }}>{children || <Outlet />}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
