import React from "react";
import { Card, Descriptions, Divider, Space, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface StudentProfileSectionProps {
  student: any;
  studentName: string;
  currentUser: any;
  renderDocumentsSection?: () => React.ReactNode;
}

export const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({
  student,
  studentName,
  currentUser,
  renderDocumentsSection,
}) => {
  return (
    <Card
      title={
        <Space>
          <UserOutlined style={{ color: "var(--primary-brand)" }} />
          <span>Student Personal Profile</span>
        </Space>
      }
      className="glass-panel"
      style={{ borderRadius: 12 }}
    >
      <Descriptions
        title="Personal & Academic Information"
        bordered
        column={{ xs: 1, sm: 2, md: 3 }}
      >
        <Descriptions.Item label="Full Name">{studentName}</Descriptions.Item>
        <Descriptions.Item label="Admission No">
          {student.admissionNo || "ADM-2026-0892"}
        </Descriptions.Item>
        <Descriptions.Item label="Roll Number">
          {student.rollNo || "24"}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          {student.gender || "Not Specified"}
        </Descriptions.Item>
        <Descriptions.Item label="Blood Group">
          {student.bloodGroup || "O+"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color="green">{student.status || "Active"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Student Email">
          {student.email || currentUser?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {student.phone || "+91 98765 43210"}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {student.address || "123 Campus Road, Academic City"}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: "24px 0" }} />

      <Descriptions
        title="Parent & Guardian Contact Information"
        bordered
        column={{ xs: 1, sm: 2, md: 3 }}
      >
        <Descriptions.Item label="Father's Name">
          {student.fatherName || "Robert Smith"}
        </Descriptions.Item>
        <Descriptions.Item label="Father's Phone">
          {student.fatherPhone || "+91 98765 00001"}
        </Descriptions.Item>
        <Descriptions.Item label="Father's Email">
          {student.fatherEmail || "father@example.com"}
        </Descriptions.Item>
        <Descriptions.Item label="Mother's Name">
          {student.motherName || "Elena Smith"}
        </Descriptions.Item>
        <Descriptions.Item label="Mother's Phone">
          {student.motherPhone || "+91 98765 00002"}
        </Descriptions.Item>
        <Descriptions.Item label="Mother's Email">
          {student.motherEmail || "mother@example.com"}
        </Descriptions.Item>
      </Descriptions>

      {renderDocumentsSection && renderDocumentsSection()}
    </Card>
  );
};
