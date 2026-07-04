import React from "react";
import { Card, Typography, Button } from "antd";
import { FireOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { toggleTheme } from "../../redux/roaster/roasterSlice";
import { useLoginFlow } from "./useLoginFlow";
import { TabSelector } from "./TabSelector";
import { LoginForm } from "./LoginForm";

const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.roaster.theme);

  const {
    form,
    loading,
    otpSent,
    role,
    timer,
    setRole,
    formatTimer,
    handleSendOTP,
    onFinish,
    resetOTPState,
  } = useLoginFlow();

  const glowBackgroundStyle = (top: boolean): React.CSSProperties => ({
    position: "absolute",
    top: top ? "-10%" : "auto",
    bottom: top ? "auto" : "-10%",
    left: top ? "-10%" : "auto",
    right: top ? "auto" : "-10%",
    width: "50vw",
    height: "50vw",
    background: top
      ? "radial-gradient(circle, rgba(69, 162, 158, 0.08) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(255, 165, 82, 0.05) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Theme Toggle in Top Right */}
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
        <Button
          type="text"
          icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => dispatch(toggleTheme())}
          style={{
            fontSize: "18px",
            width: 40,
            height: 40,
            color: "var(--text-secondary)",
          }}
        />
      </div>
      <div style={glowBackgroundStyle(true)} />
      <div style={glowBackgroundStyle(false)} />

      <Card
        className="glass-panel glow-card"
        style={{
          width: "100%",
          maxWidth: 420,
          zIndex: 1,
          padding: "12px 8px",
          border: "1px solid var(--border-muted)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #45a29e 0%, #ffa552 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(69, 162, 158, 0.4)",
              marginBottom: 16,
            }}
          >
            <FireOutlined style={{ fontSize: 24, color: "#fff" }} />
          </div>
          <Title
            level={2}
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              letterSpacing: -0.5,
              color: "var(--text-primary)",
            }}
          >
            RANK <span style={{ color: "#ffa552" }}>ROASTER</span>
          </Title>
          <Text style={{ color: "var(--text-secondary)", display: "block", marginTop: 4 }}>
            School Portal
          </Text>
        </div>

        <TabSelector role={role} onChange={setRole} disabled={otpSent} />

        <LoginForm
          form={form}
          role={role}
          otpSent={otpSent}
          loading={loading}
          timer={timer}
          formatTimer={formatTimer}
          handleSendOTP={handleSendOTP}
          onFinish={onFinish}
          resetOTPState={resetOTPState}
        />
      </Card>
    </div>
  );
};
