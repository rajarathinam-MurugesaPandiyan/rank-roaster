import React from "react";
import { Layout, Menu, Space, Typography } from "antd";
import {
  DashboardOutlined,
  UserAddOutlined,
  BookOutlined,
  FireOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  CalendarOutlined,
  ReadOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Title } = Typography;

const iconMap: { [key: string]: React.ReactNode } = {
  dashboard: <DashboardOutlined />,
  onboarding: <UserAddOutlined />,
  classes: <BookOutlined />,
  teachers: <UserOutlined />,
  students: <TeamOutlined />,
  grades: <SolutionOutlined />,
  academic: <ReadOutlined />,
  events: <CalendarOutlined />,
};

interface SidebarProps {
  collapsed: boolean;
  tabs: { key: string; label: string; icon?: any }[];
  selectedKey: string;
  onMenuClick: (info: { key: string }) => void;
  theme: "dark" | "light";
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  tabs,
  selectedKey,
  onMenuClick,
  theme,
}) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      theme={theme}
      style={{
        background: "var(--bg-container)",
        borderRight: "1px solid var(--border-muted)",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 10,
      }}
    >
      <div
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "0" : "0 24px",
          borderBottom: "1px solid var(--border-muted)",
        }}
      >
        <Space size={12}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #45a29e 0%, #ffa552 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(69, 162, 158, 0.4)",
            }}
          >
            <FireOutlined style={{ fontSize: 16, color: "#fff" }} />
          </div>
          {!collapsed && (
            <Title
              level={5}
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: -0.5,
              }}
            >
              RANK <span style={{ color: "#ffa552" }}>ROASTER</span>
            </Title>
          )}
        </Space>
      </div>

      <Menu
        theme={theme}
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={onMenuClick}
        style={{ background: "transparent", marginTop: 16, border: "none" }}
        items={tabs.map((tab) => {
          const resolvedIcon = tab.icon
            ? (typeof tab.icon === "string" ? iconMap[tab.icon] : tab.icon)
            : (iconMap[tab.key] || <BookOutlined />);
          return {
            key: tab.key,
            icon: resolvedIcon,
            label: tab.label,
          };
        })}
      />
    </Sider>
  );
};
