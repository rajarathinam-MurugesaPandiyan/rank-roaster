import React from "react";
import { Card, Row, Col, Typography, Space } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface StudentPaymentsSectionProps {
  student: any;
}

export const StudentPaymentsSection: React.FC<StudentPaymentsSectionProps> = ({
  student,
}) => {
  return (
    <Card
      title={
        <Space>
          <CreditCardOutlined style={{ color: "var(--primary-brand)" }} />
          <span>School Fees & Payment Ledger</span>
        </Space>
      }
      className="glass-panel"
      style={{ borderRadius: 12 }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card type="inner" style={{ textAlign: "center" }}>
            <Text type="secondary">Total Annual Fee</Text>
            <Title
              level={3}
              style={{ margin: 0, color: "var(--text-primary)" }}
            >
              ₹{(student.totalFees || 45000).toLocaleString("en-IN")}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card type="inner" style={{ textAlign: "center" }}>
            <Text type="secondary">Fees Paid To Date</Text>
            <Title level={3} style={{ margin: 0, color: "#059669" }}>
              ₹{(student.feesPaid || 45000).toLocaleString("en-IN")}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card type="inner" style={{ textAlign: "center" }}>
            <Text type="secondary">Remaining Balance</Text>
            <Title level={3} style={{ margin: 0, color: "#d97706" }}>
              ₹{(student.remainingFees || 0).toLocaleString("en-IN")}
            </Title>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
