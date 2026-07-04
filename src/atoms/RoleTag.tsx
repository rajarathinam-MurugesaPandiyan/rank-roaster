import React from "react";
import { Tag } from "antd";

interface RoleTagProps {
  role: "Student" | "Teacher" | "Staff" | string;
}

export const RoleTag: React.FC<RoleTagProps> = ({ role }) => {
  return (
    <Tag
      color={role === "Teacher" ? "#ffa552" : "#45a29e"}
      style={{
        border: "none",
        color: "#fff",
        padding: "2px 8px",
        borderRadius: 4,
      }}
    >
      {role}
    </Tag>
  );
};
