import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { SafetyCertificateOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const StudentPermissionsSection: React.FC = () => {
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissionForm] = Form.useForm();
  const [permissionsList, setPermissionsList] = useState([
    {
      id: "perm-1",
      type: "Leave Application",
      reason: "Family Event & Medical Checkup",
      fromDate: "2026-08-05",
      toDate: "2026-08-07",
      status: "Approved",
      appliedOn: "2026-08-01",
    },
    {
      id: "perm-2",
      type: "Gate Pass / Early Exit",
      reason: "Dental Appointment",
      fromDate: "2026-08-10",
      toDate: "2026-08-10",
      status: "Pending",
      appliedOn: "2026-08-01",
    },
  ]);

  const handleCreatePermission = (values: any) => {
    const newPerm = {
      id: `perm-${Date.now()}`,
      type: values.type,
      reason: values.reason,
      fromDate: values.fromDate,
      toDate: values.toDate || values.fromDate,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };
    setPermissionsList([newPerm, ...permissionsList]);
    message.success("Permission request submitted successfully!");
    setPermissionModalVisible(false);
    permissionForm.resetFields();
  };

  return (
    <>
      <Card
        title={
          <Space>
            <SafetyCertificateOutlined
              style={{ color: "var(--primary-brand)" }}
            />
            <span>Leave & Permission Requests</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setPermissionModalVisible(true)}
            style={{ background: "var(--primary-brand)" }}
          >
            Apply New Permission
          </Button>
        }
        className="glass-panel"
        style={{ borderRadius: 12 }}
      >
        <Table
          dataSource={permissionsList}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "Type",
              dataIndex: "type",
              key: "type",
              render: (t) => <Text strong>{t}</Text>,
            },
            { title: "Reason", dataIndex: "reason", key: "reason" },
            { title: "From Date", dataIndex: "fromDate", key: "fromDate" },
            { title: "To Date", dataIndex: "toDate", key: "toDate" },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (st) => (
                <Tag
                  color={
                    st === "Approved"
                      ? "green"
                      : st === "Pending"
                        ? "gold"
                        : "red"
                  }
                >
                  {st}
                </Tag>
              ),
            },
            { title: "Applied On", dataIndex: "appliedOn", key: "appliedOn" },
          ]}
        />
      </Card>

      {/* Permission Modal */}
      <Modal
        title="Apply for Permission / Leave"
        open={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        footer={null}
      >
        <Form
          form={permissionForm}
          layout="vertical"
          onFinish={handleCreatePermission}
        >
          <Form.Item
            name="type"
            label="Permission Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select type">
              <Option value="Leave Application">Leave Application</Option>
              <Option value="Gate Pass / Early Exit">
                Gate Pass / Early Exit
              </Option>
              <Option value="Medical Leave">Medical Leave</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fromDate"
            label="From Date"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item name="toDate" label="To Date">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Provide clear reason..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => setPermissionModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "var(--primary-brand)" }}
            >
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
