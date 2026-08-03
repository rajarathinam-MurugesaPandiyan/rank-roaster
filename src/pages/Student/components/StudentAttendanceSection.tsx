import React from "react";
import {
  Card,
  Row,
  Col,
  Progress,
  Typography,
  Descriptions,
  Space,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const StudentAttendanceSection: React.FC = () => {
  return (
    <Card
      title={
        <Space>
          <CalendarOutlined style={{ color: "var(--primary-brand)" }} />
          <span>Attendance Tracking & Summary</span>
        </Space>
      }
      className="glass-panel"
      style={{ borderRadius: 12 }}
    >
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} sm={8} style={{ textAlign: "center" }}>
          <Progress
            type="circle"
            percent={96}
            strokeColor="var(--primary-brand)"
            width={130}
          />
          <Title level={5} style={{ marginTop: 16 }}>
            Overall Attendance Rate
          </Title>
        </Col>
        <Col xs={24} sm={16}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Total Working Days">
              180 Days
            </Descriptions.Item>
            <Descriptions.Item label="Days Present">173 Days</Descriptions.Item>
            <Descriptions.Item label="Medical / Approved Leaves">
              5 Days
            </Descriptions.Item>
            <Descriptions.Item label="Unexcused Absences">
              2 Days
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};
