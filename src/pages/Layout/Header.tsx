import React from "react";
import { Layout, Button, Space, Typography, Dropdown, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import type { User } from "../../redux/roaster/roasterSlice";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  displaySchoolName: string;
  currentUser: User | null;
  currentSchool: User | null;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  displaySchoolName,
  currentUser,
  currentSchool,
  onLogout,
  theme,
  onToggleTheme,
}) => {
  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userObj = currentUser || currentSchool;
  const userMenuItems = {
    items: [
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: onLogout,
      },
    ],
  };

  return (
    <AntHeader
      style={{
        background: "var(--header-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-muted)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 9,
        height: 72,
      }}
    >
      <Space size={16}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 40,
            height: 40,
            color: "var(--text-secondary)",
          }}
        />
        <Title
          level={4}
          style={{
            margin: 0,
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
          }}
        >
          {displaySchoolName}
        </Title>
      </Space>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Button
          type="text"
          icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={onToggleTheme}
          style={{
            fontSize: "18px",
            width: 40,
            height: 40,
            color: "var(--text-secondary)",
          }}
        />

        <Dropdown menu={userMenuItems} trigger={["click"]}>
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Avatar
              style={{
                backgroundColor: "#45a29e",
                verticalAlign: "middle",
                boxShadow: "0 0 10px rgba(69, 162, 158, 0.3)",
              }}
              size="default"
            >
              {getInitials(userObj?.name)}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};
