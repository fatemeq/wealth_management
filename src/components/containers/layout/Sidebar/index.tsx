import React from "react";
import { Menu } from "antd";
import { PieChartOutlined, WalletOutlined, SettingOutlined, BlockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isRtl?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isRtl = false }) => {
  const { t } = useTranslation();
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
        { key: "", icon: <PieChartOutlined />, label: t("sidebar.dashboard") },
        { key: "accounts", icon: <WalletOutlined />, label: t("sidebar.accounts") },
        { key: "settings", icon: <SettingOutlined />, label: t("sidebar.settings") },
        { key: "units", icon: <BlockOutlined />, label: t("units.units") },
      ]}
      style={{
        flex: 1,
        overflowY: "auto",
        height: "calc(100vh - 150px)",
      }}
      inlineCollapsed={false}
      direction={isRtl ? "rtl" : "ltr"}
    />
  );
};

export default Sidebar;
