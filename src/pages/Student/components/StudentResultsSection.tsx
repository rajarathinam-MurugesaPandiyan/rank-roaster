import React from "react";
import { Card, Table, Typography, Tag, Space } from "antd";
import { SolutionOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const StudentResultsSection: React.FC = () => {
  return (
    <Card
      title={
        <Space>
          <SolutionOutlined style={{ color: "var(--primary-brand)" }} />
          <span>Academic Exam Results & Progress</span>
        </Space>
      }
      className="glass-panel"
      style={{ borderRadius: 12 }}
    >
      <Table
        pagination={false}
        dataSource={[
          {
            key: "1",
            subject: "Mathematics - Advanced Calculus",
            maxMarks: 100,
            obtainedMarks: 94,
            grade: "A+",
            status: "Passed",
          },
          {
            key: "2",
            subject: "Physics & Thermodynamics",
            maxMarks: 100,
            obtainedMarks: 88,
            grade: "A",
            status: "Passed",
          },
          {
            key: "3",
            subject: "Computer Science & Data Structures",
            maxMarks: 100,
            obtainedMarks: 96,
            grade: "A+",
            status: "Passed",
          },
          {
            key: "4",
            subject: "English Language & Literature",
            maxMarks: 100,
            obtainedMarks: 85,
            grade: "A",
            status: "Passed",
          },
          {
            key: "5",
            subject: "Chemistry & Organic Analysis",
            maxMarks: 100,
            obtainedMarks: 90,
            grade: "A+",
            status: "Passed",
          },
        ]}
        columns={[
          {
            title: "Subject Name",
            dataIndex: "subject",
            key: "subject",
            render: (t) => <Text strong>{t}</Text>,
          },
          { title: "Max Marks", dataIndex: "maxMarks", key: "maxMarks" },
          {
            title: "Obtained Marks",
            dataIndex: "obtainedMarks",
            key: "obtainedMarks",
            render: (m) => (
              <Text style={{ color: "var(--primary-brand)", fontWeight: 700 }}>
                {m}
              </Text>
            ),
          },
          {
            title: "Grade",
            dataIndex: "grade",
            key: "grade",
            render: (g) => <Tag color="blue">{g}</Tag>,
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (s) => <Tag color="green">{s}</Tag>,
          },
        ]}
      />
    </Card>
  );
};
