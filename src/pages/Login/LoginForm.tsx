import React from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";

interface LoginFormProps {
  form: FormInstance;
  role: "teacher" | "student" | "school";
  otpSent: boolean;
  loading: boolean;
  timer: number;
  formatTimer: (seconds: number) => string;
  handleSendOTP: () => void;
  onFinish: (values: any) => void;
  resetOTPState: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  form,
  role,
  otpSent,
  loading,
  timer,
  formatTimer,
  handleSendOTP,
  onFinish,
  resetOTPState,
}) => {
  const inputStyle = {
    borderRadius: 8,
    background: "var(--bg-container)",
    border: "1px solid var(--border-muted)",
    color: "var(--text-primary)",
  };

  return (
    <Form
      form={form}
      name="login_form"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ email: "" }}
      requiredMark={false}
    >
      <Form.Item
        name="email"
        label={
          <span style={{ color: "var(--text-secondary)" }}>Email Address</span>
        }
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please input a valid email!" },
        ]}
      >
        <Input
          prefix={<MailOutlined style={{ color: "var(--text-secondary)" }} />}
          placeholder="name@school.edu"
          disabled={role !== "student" && otpSent}
          style={inputStyle}
        />
      </Form.Item>

      {role === "teacher" && (
        <Form.Item
          name="dob"
          label={
            <span style={{ color: "var(--text-secondary)" }}>
              Date of Birth
            </span>
          }
          rules={[
            { required: true, message: "Please input your Date of Birth!" },
          ]}
        >
          <Input
            type="date"
            disabled={otpSent}
            style={{ ...inputStyle, colorScheme: "dark" }}
          />
        </Form.Item>
      )}

      {otpSent && (
        <>
          <Form.Item
            name="otp"
            label={
              <span style={{ color: "var(--text-secondary)" }}>
                Verification OTP
              </span>
            }
            rules={[{ required: true, message: "Please input the OTP!" }]}
          >
            <Input
              prefix={
                <LockOutlined style={{ color: "var(--text-secondary)" }} />
              }
              placeholder="Enter OTP"
              style={inputStyle}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Button
              type="link"
              onClick={resetOTPState}
              style={{ color: "var(--primary-brand)", padding: 0 }}
            >
              Change Details
            </Button>
            {timer > 0 ? (
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                Resend OTP in{" "}
                <strong style={{ color: "var(--accent-amber)" }}>
                  {formatTimer(timer)}
                </strong>
              </span>
            ) : (
              <Button
                type="link"
                onClick={handleSendOTP}
                style={{
                  color: "var(--accent-amber)",
                  padding: 0,
                  fontWeight: 600,
                }}
              >
                Resend OTP
              </Button>
            )}
          </div>
        </>
      )}

      <Form.Item style={{ marginTop: 24, marginBottom: 8 }}>
        <Button
          type="primary"
          htmlType={role === "student" || otpSent ? "submit" : "button"}
          onClick={role === "student" || otpSent ? undefined : handleSendOTP}
          loading={loading}
          block
          style={{
            borderRadius: 8,
            height: 44,
            background: "var(--primary-brand)",
            border: "none",
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
            color: "#ffffff",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
          }}
        >
          {role === "student"
            ? "Sign In as Student"
            : otpSent
              ? "Verify & Sign In"
              : "Send OTP"}
        </Button>
      </Form.Item>
    </Form>
  );
};
