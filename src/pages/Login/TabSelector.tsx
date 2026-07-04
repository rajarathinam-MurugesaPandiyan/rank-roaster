import React from "react";

interface TabSelectorProps {
  role: "teacher" | "student" | "school";
  onChange: (role: "teacher" | "student" | "school") => void;
  disabled: boolean;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ role, onChange, disabled }) => {
  const getStyle = (active: boolean) => ({
    flex: 1,
    padding: "10px 12px",
    borderRadius: "6px",
    border: "none",
    background: active ? "linear-gradient(135deg, #45a29e 0%, #ffa552 100%)" : "transparent",
    color: active ? "#ffffff" : "var(--text-secondary)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    opacity: disabled && !active ? 0.5 : 1,
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        background: "var(--bg-container)",
        padding: "4px",
        borderRadius: "8px",
        border: "1px solid var(--border-muted)",
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("student")}
        style={getStyle(role === "student")}
      >
        Student
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("teacher")}
        style={getStyle(role === "teacher")}
      >
        Teacher
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("school")}
        style={getStyle(role === "school")}
      >
        School
      </button>
    </div>
  );
};
