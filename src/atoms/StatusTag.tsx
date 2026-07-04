import React from "react";
import { Tag } from "antd";

interface StatusTagProps {
  status:
    | "Pending"
    | "Verified"
    | "Enrolled"
    | "Active"
    | "Inactive"
    | "active"
    | "inactive"
    | string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  let color = "#ffa552"; // Pending -> Amber
  const normalized = status?.toLowerCase();

  if (normalized === "enrolled") {
    color = "#45a29e"; // Enrolled -> Teal
  } else if (normalized === "verified") {
    color = "cyan"; // Verified -> Cyan
  } else if (normalized === "active") {
    color = "#2ea043"; // Active -> Green
  } else if (normalized === "inactive") {
    color = "#f85149"; // Inactive -> Red
  }

  return (
    <Tag
      color={color}
      style={{ border: "none", padding: "2px 8px", borderRadius: 4 }}
    >
      {status}
    </Tag>
  );
};
