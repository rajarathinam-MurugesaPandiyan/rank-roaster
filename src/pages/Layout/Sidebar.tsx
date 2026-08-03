import React from "react";
import { Layout, Menu, Space, Typography } from "antd";
import {
  DashboardOutlined,
  UserAddOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  CalendarOutlined,
  ReadOutlined,
  DollarOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import LottieModule from "lottie-react";
import brandAnimation from "../../assets/brand.json";

const { Sider } = Layout;
const { Title } = Typography;

const LottieComponent: any =
  typeof LottieModule === "function"
    ? LottieModule
    : (LottieModule as any)?.default;

const iconMap: { [key: string]: React.ReactNode } = {
  dashboard: <DashboardOutlined />,
  onboarding: <UserAddOutlined />,
  classes: <BookOutlined />,
  teachers: <UserOutlined />,
  students: <TeamOutlined />,
  fees: <DollarOutlined />,
  events: <CalendarOutlined />,
  academic: <ReadOutlined />,
  grades: <SolutionOutlined />,
  profile: <UserOutlined />,
  results: <SolutionOutlined />,
  awards: <TrophyOutlined />,
  permissions: <SafetyCertificateOutlined />,
  attendance: <CalendarOutlined />,
  payments: <CreditCardOutlined />,
  feedback: <CommentOutlined />,
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
  tabs = [],
  selectedKey,
  onMenuClick,
  theme = "dark",
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
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {LottieComponent && (
              <LottieComponent
                animationData={brandAnimation}
                loop={true}
                style={{ width: 36, height: 36 }}
              />
            )}
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
              CAMPUS <span style={{ color: "var(--accent-cyan)" }}>DECK</span>
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
        items={(tabs || []).map((tab) => {
          let resolvedIcon: React.ReactNode = <BookOutlined />;
          if (typeof tab.icon === "string" && iconMap[tab.icon]) {
            resolvedIcon = iconMap[tab.icon];
          } else if (React.isValidElement(tab.icon)) {
            resolvedIcon = tab.icon;
          } else if (iconMap[tab.key]) {
            resolvedIcon = iconMap[tab.key];
          }
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

