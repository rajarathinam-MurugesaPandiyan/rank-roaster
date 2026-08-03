import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Rate,
  Typography,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { CommentOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { TextArea } = Input;

export const StudentFeedbackSection: React.FC = () => {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackForm] = Form.useForm();
  const [feedbackList, setFeedbackList] = useState([
    {
      id: "fb-1",
      subject: "Mathematics - Calculus Module",
      rating: 5,
      comment: "Excellent interactive practical sessions!",
      date: "2026-07-28",
    },
  ]);

  const handleCreateFeedback = (values: any) => {
    const newFb = {
      id: `fb-${Date.now()}`,
      subject: values.subject,
      rating: values.rating,
      comment: values.comment,
      date: new Date().toISOString().split("T")[0],
    };
    setFeedbackList([newFb, ...feedbackList]);
    message.success("Feedback submitted successfully!");
    setFeedbackModalVisible(false);
    feedbackForm.resetFields();
  };

  return (
    <>
      <Card
        title={
          <Space>
            <CommentOutlined style={{ color: "var(--primary-brand)" }} />
            <span>Feedback & Communication</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setFeedbackModalVisible(true)}
            style={{ background: "var(--primary-brand)" }}
          >
            Submit Feedback
          </Button>
        }
        className="glass-panel"
        style={{ borderRadius: 12 }}
      >
        <Table
          dataSource={feedbackList}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "Subject / Topic",
              dataIndex: "subject",
              key: "subject",
              render: (s) => <Text strong>{s}</Text>,
            },
            {
              title: "Rating",
              dataIndex: "rating",
              key: "rating",
              render: (r) => <Rate disabled defaultValue={r} />,
            },
            { title: "Comment", dataIndex: "comment", key: "comment" },
            { title: "Submitted Date", dataIndex: "date", key: "date" },
          ]}
        />
      </Card>

      {/* Feedback Modal */}
      <Modal
        title="Submit Course / Teacher Feedback"
        open={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        footer={null}
      >
        <Form
          form={feedbackForm}
          layout="vertical"
          onFinish={handleCreateFeedback}
        >
          <Form.Item
            name="subject"
            label="Subject / Faculty Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Mathematics Class" />
          </Form.Item>
          <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Feedback Comment"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={3}
              placeholder="Share your experience and thoughts..."
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => setFeedbackModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "var(--primary-brand)" }}
            >
              Submit Feedback
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
