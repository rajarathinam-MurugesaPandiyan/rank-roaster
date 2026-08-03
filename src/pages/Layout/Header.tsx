import React from "react";
import { Layout, Button, Space, Typography, Dropdown, Avatar, Tag } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import type { User } from "../../redux/roaster/roasterSlice";
import { AsyncAvatar } from "../../components/AsyncAvatar";

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
  const isStudent = userObj?.role === "student";

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
      <Space size={16} align="center">
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
        {displaySchoolName && (
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
        )}
        {isStudent && (
          <Tag
            color="purple"
            icon={<CrownOutlined />}
            style={{
              borderRadius: 6,
              fontWeight: 700,
              padding: "3px 10px",
              fontSize: 11,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              border: "none",
              boxShadow: "0 2px 6px rgba(147, 51, 234, 0.25)",
            }}
          >
            Student Portal
          </Tag>
        )}
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
            <AsyncAvatar
              src={userObj?.photoUrl || userObj?.image_url}
              style={{
                backgroundColor: "var(--primary-brand)",
                verticalAlign: "middle",
                boxShadow: "0 0 10px rgba(79, 70, 229, 0.3)",
              }}
              size="default"
              icon={getInitials(userObj?.name)}
            />
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};
