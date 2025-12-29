// Sidebar.tsx
import React from "react";
import { Menu } from "antd";
import {
  PieChartOutlined,
  WalletOutlined,
  SettingOutlined,
  BlockOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.split("/")[1] || "";

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={({ key }) => navigate(`/${key}`)}
      items={[
        { key: "", icon: <PieChartOutlined />, label: "Dashboard" },
        { key: "accounts", icon: <WalletOutlined />, label: "Accounts" },
        { key: "settings", icon: <SettingOutlined />, label: "Settings" },
        { key: "units", icon: <BlockOutlined />, label: "Units" },
      ]}
      style={{ flex: 1, overflowY: "auto", height: "calc(100vh - 150px)" }}
    />
  );
};

export default Sidebar;
