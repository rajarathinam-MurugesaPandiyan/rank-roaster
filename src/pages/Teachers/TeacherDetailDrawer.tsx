import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Row,
  Col,
  message,
  Switch,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  updateTeacher,
  type TeacherItem,
} from "../../redux/teachers/teachersSlice";

const { Text } = Typography;
const { Option } = Select;

interface TeacherDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  teacher: TeacherItem | null;
}

export const TeacherDetailDrawer: React.FC<TeacherDetailDrawerProps> = ({
  visible,
  onClose,
  teacher,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { loading } = useAppSelector((state) => state.teachers);

  // Reset/Set values whenever a new teacher is selected
  useEffect(() => {
    if (visible && teacher) {
      form.setFieldsValue({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone || "",
        alt_phone: teacher.alt_phone || "",
        gender: teacher.gender || "male",
        dob: teacher.dob || "",
        subject: teacher.subject || "",
        department: teacher.department || "",
        experience: teacher.experience || "",
        qualification: teacher.qualification || "",
        address: teacher.address || "",
        city: teacher.city || "",
        state: teacher.state || "",
        country: teacher.country || "",
        status: teacher.status || "active",
        is_admin: teacher.is_admin || false,
      });
    }
  }, [visible, teacher, form]);

  const onFinish = (values: any) => {
    if (!teacher) return;

    const schoolId = teacher.school_id || teacher.schoolId;
    if (!schoolId) {
      message.error("School ID is missing. Cannot perform update.");
      return;
    }

    dispatch(
      updateTeacher({
        id: teacher.id,
        schoolId: schoolId,
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          is_admin: values.is_admin,
          subject: values.subject,
          department: values.department,
          documents: teacher.documents || [],
          experience: values.experience,
          qualification: values.qualification,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          status: values.status,
          alt_phone: values.alt_phone,
          gender: values.gender,
          dob: values.dob,
        },
      }),
    )
      .unwrap()
      .then(() => {
        message.success(`Successfully updated details for ${values.name}!`);
        onClose();
      })
      .catch((err) => {
        message.error(err || "Failed to update teacher details");
      });
  };

  return (
    <Drawer
      title={
        <div
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
          }}
        >
          Teacher Profile Details
        </div>
      }
      placement="right"
      width={480}
      onClose={onClose}
      open={visible}
      destroyOnClose
      rootClassName="no-scrollbar-drawer"
      style={{
        background: "var(--bg-container)",
        borderLeft: "1px solid var(--border-muted)",
      }}
      headerStyle={{
        borderBottom: "1px solid var(--border-muted)",
        background: "var(--bg-container)",
      }}
      bodyStyle={{
        background: "var(--bg-container)",
        padding: 24,
      }}
      footerStyle={{
        borderTop: "1px solid var(--border-muted)",
        background: "var(--bg-container)",
        padding: "16px 24px",
        textAlign: "right",
      }}
      footer={
        <Space size={12}>
          <Button
            onClick={onClose}
            style={{
              background: "transparent",
              borderColor: "var(--border-muted)",
              color: "var(--text-secondary)",
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            style={{
              background: "#45a29e",
              borderColor: "#45a29e",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
            }}
          >
            Update Details
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Text
          style={{
            color: "#45a29e",
            fontWeight: 600,
            display: "block",
            marginBottom: 16,
          }}
        >
          Personal Information
        </Text>

        <Form.Item
          name="name"
          label={
            <span style={{ color: "var(--text-secondary)" }}>Full Name</span>
          }
          rules={[{ required: true, message: "Please input full name!" }]}
        >
          <Input
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-muted)",
              color: "var(--text-primary)",
            }}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={
            <span style={{ color: "var(--text-secondary)" }}>
              Email Address
            </span>
          }
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Please input a valid email!" },
          ]}
        >
          <Input
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-muted)",
              color: "var(--text-primary)",
            }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Phone Number
                </span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="alt_phone"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Alternate Phone
                </span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label={
                <span style={{ color: "var(--text-secondary)" }}>Gender</span>
              }
            >
              <Select dropdownStyle={{ background: "var(--bg-elevated)" }}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dob"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Date of Birth
                </span>
              }
            >
              <Input
                placeholder="YYYY-MM-DD"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            borderTop: "1px solid var(--border-muted)",
            margin: "24px 0",
          }}
        />
        <Text
          style={{
            color: "#ffa552",
            fontWeight: 600,
            display: "block",
            marginBottom: 16,
          }}
        >
          Professional Details
        </Text>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="subject"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Subject Specialization
                </span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Department
                </span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="experience"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Experience (Years)
                </span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="qualification"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Highest Qualification
                </span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Employment Status
                </span>
              }
            >
              <Select dropdownStyle={{ background: "var(--bg-elevated)" }}>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="is_admin"
              valuePropName="checked"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Administrator Role
                </span>
              }
            >
              <Switch
                checkedChildren="ADMIN"
                unCheckedChildren="STAFF"
                style={{ marginTop: 6 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            borderTop: "1px solid var(--border-muted)",
            margin: "24px 0",
          }}
        />
        <Text
          style={{
            color: "#45a29e",
            fontWeight: 600,
            display: "block",
            marginBottom: 16,
          }}
        >
          Contact Address
        </Text>

        <Form.Item
          name="address"
          label={
            <span style={{ color: "var(--text-secondary)" }}>
              Street Address
            </span>
          }
        >
          <Input
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-muted)",
              color: "var(--text-primary)",
            }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="city"
              label={
                <span style={{ color: "var(--text-secondary)" }}>City</span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="state"
              label={
                <span style={{ color: "var(--text-secondary)" }}>State</span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="country"
              label={
                <span style={{ color: "var(--text-secondary)" }}>Country</span>
              }
            >
              <Input
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-muted)",
                  color: "var(--text-primary)",
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
