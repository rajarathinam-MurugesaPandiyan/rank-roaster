import React from "react";
import { Card, Row, Col, Typography, Tag, Avatar, Space } from "antd";
import { UserOutlined, CrownOutlined } from "@ant-design/icons";
import { AsyncAvatar } from "../../../components/AsyncAvatar";

const { Title, Text } = Typography;

interface StudentHeaderBannerProps {
  student: any;
  studentName: string;
  currentUser: any;
}

export const StudentHeaderBanner: React.FC<StudentHeaderBannerProps> = ({
  student,
  studentName,
  currentUser,
}) => {
  return (
    <>
      {/* Student Portal Branding Header */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              fontWeight: 700,
            }}
          >
            Student Portal
          </Title>
          <Text style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            Welcome to your Student Portal. Access your academic profile, exam
            results, attendance, and permissions.
          </Text>
        </div>
        <Tag
          color="purple"
          icon={<CrownOutlined />}
          style={{
            fontSize: 13,
            padding: "6px 14px",
            borderRadius: 8,
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            border: "none",
            boxShadow: "0 2px 8px rgba(147, 51, 234, 0.2)",
          }}
        >
          Student Portal
        </Tag>
      </div>

      {/* Header Profile Summary Banner */}
      <Card
        className="glass-panel"
        style={{
          marginBottom: 24,
          borderRadius: 12,
          border: "1px solid var(--border-muted)",
          background: "var(--bg-container)",
        }}
      >
        <Row align="middle" gutter={[24, 16]}>
          <Col>
            <AsyncAvatar
              size={72}
              icon={<UserOutlined />}
              src={
                student?.photoUrl ||
                student?.photo_url ||
                student?.photo ||
                student?.avatar ||
                currentUser?.photoUrl ||
                currentUser?.photo_url ||
                currentUser?.avatar
              }
              style={{
                backgroundColor: "var(--primary-brand)",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              }}
            />
          </Col>
          <Col flex="1">
            <Space direction="vertical" size={2}>
              <Space align="center" wrap>
                <Title
                  level={3}
                  style={{ margin: 0, color: "var(--text-primary)" }}
                >
                  {studentName}
                </Title>
                <Tag
                  color="purple"
                  style={{ borderRadius: 6, fontWeight: 700 }}
                >
                  Student Portal
                </Tag>
                <Tag color="blue" style={{ borderRadius: 6, fontWeight: 600 }}>
                  Grade{" "}
                  {student.gradeId || student.enrollment?.grade_id || "10-A"}
                </Tag>
                <Tag color="green" style={{ borderRadius: 6, fontWeight: 600 }}>
                  {student.status || "Active Student"}
                </Tag>
              </Space>
              <Text style={{ color: "var(--text-secondary)" }}>
                Admission No:{" "}
                <strong>{student.admissionNo || "ADM-2026-0892"}</strong> | Roll
                No: <strong>{student.rollNo || "24"}</strong> | Email:{" "}
                <strong>
                  {student.email ||
                    currentUser?.email ||
                    "student@academiciq.edu"}
                </strong>
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};
