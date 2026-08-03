import React from "react";
import { Card, Row, Col, Typography, Space } from "antd";
import { TrophyOutlined, CrownOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

export const StudentAwardsSection: React.FC = () => {
  return (
    <Card
      title={
        <Space>
          <TrophyOutlined style={{ color: "var(--primary-brand)" }} />
          <span>Awards, Achievements & Honors</span>
        </Space>
      }
      className="glass-panel"
      style={{ borderRadius: 12 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            type="inner"
            title={
              <Space>
                <CrownOutlined style={{ color: "#d97706" }} />
                <span>Gold Medalist - Science Olympiad 2026</span>
              </Space>
            }
          >
            <Paragraph style={{ margin: 0 }}>
              Secured 1st Rank in District Level Inter-School Science & AI
              Innovation Championship.
            </Paragraph>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Awarded on: 2026-05-15
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            type="inner"
            title={
              <Space>
                <TrophyOutlined style={{ color: "var(--primary-brand)" }} />
                <span>100% Attendance Excellence Award</span>
              </Space>
            }
          >
            <Paragraph style={{ margin: 0 }}>
              Recognized for flawless academic session attendance with 0
              unexcused absences.
            </Paragraph>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Awarded on: 2026-04-10
            </Text>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
