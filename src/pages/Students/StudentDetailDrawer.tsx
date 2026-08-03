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
  Card,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { AsyncAvatar } from "../../components/AsyncAvatar";
import type { StudentItem } from "../../redux/students/studentsSlice";

const { Text } = Typography;
const { Option } = Select;

interface StudentDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  student: StudentItem | null;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  visible,
  onClose,
  student,
}) => {
  const [form] = Form.useForm();

  // Reset/Set values whenever a new student is selected
  useEffect(() => {
    if (visible && student) {
      // Format Date of Birth string (YYYY-MM-DD)
      let formattedDob = "";
      if (student.dateOfBirth) {
        try {
          formattedDob = student.dateOfBirth.substring(0, 10);
        } catch {
          formattedDob = student.dateOfBirth;
        }
      }

      form.setFieldsValue({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email || "",
        phone: student.phone || "",
        gender: student.gender || "male",
        dob: formattedDob,
        admissionNo: student.admissionNo || "",
        rollNo: student.rollNo || "",
        bloodGroup: student.bloodGroup || "",
        status: student.status || "Active",
        fatherName: student.fatherName || "",
        fatherPhone: student.fatherPhone || "",
        fatherEmail: student.fatherEmail || "",
        motherName: student.motherName || "",
        motherPhone: student.motherPhone || "",
        motherEmail: student.motherEmail || "",
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
        guardianEmail: student.guardianEmail || "",
        guardianRelation: student.guardianRelation || "",
        address: student.address || "",
      });
    }
  }, [visible, student, form]);

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
          Student Profile Details
        </div>
      }
      placement="right"
      width={500}
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
            Close
          </Button>
        </Space>
      }
    >
      {/* Student Profile Photo Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          padding: 16,
          background: "var(--bg-elevated)",
          borderRadius: 12,
          border: "1px solid var(--border-muted)",
        }}
      >
        <AsyncAvatar
          size={72}
          src={student?.photoUrl || (student as any)?.photo_url}
          icon={<UserOutlined />}
          style={{ backgroundColor: "var(--primary-brand)" }}
        />
        <div>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
              display: "block",
            }}
          >
            {student?.fullName || `${student?.firstName} ${student?.lastName}`}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Roll No: {student?.rollNo || "N/A"} | Admission:{" "}
            {student?.admissionNo || "N/A"}
          </Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        disabled // Read-only viewing as update is handled in onboarding/other actions
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  First Name
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
              name="lastName"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Last Name
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
              name="email"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Email Address
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
              name="admissionNo"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Admission Number
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
              name="rollNo"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Roll Number
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
              name="bloodGroup"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Blood Group
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
              name="status"
              label={
                <span style={{ color: "var(--text-secondary)" }}>Status</span>
              }
            >
              <Select dropdownStyle={{ background: "var(--bg-elevated)" }}>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
                <Option value="Graduated">Graduated</Option>
                <Option value="Transferred">Transferred</Option>
              </Select>
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
          Father Details
        </Text>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fatherName"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Father's Name
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
              name="fatherPhone"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Father's Phone
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
        <Form.Item
          name="fatherEmail"
          label={
            <span style={{ color: "var(--text-secondary)" }}>
              Father's Email
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
          Mother Details
        </Text>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="motherName"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Mother's Name
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
              name="motherPhone"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Mother's Phone
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
        <Form.Item
          name="motherEmail"
          label={
            <span style={{ color: "var(--text-secondary)" }}>
              Mother's Email
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
          Guardian Details
        </Text>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="guardianName"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Guardian's Name
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
              name="guardianPhone"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Guardian's Phone
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
              name="guardianEmail"
              label={
                <span style={{ color: "var(--text-secondary)" }}>
                  Guardian's Email
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
              name="guardianRelation"
              label={
                <span style={{ color: "var(--text-secondary)" }}>Relation</span>
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
          Address
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

        {student?.documents && student.documents.length > 0 && (
          <>
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
              Supporting Documents
            </Text>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {student.documents.map((doc, idx) => (
                <Card
                  key={idx}
                  size="small"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-muted)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Space>
                      <FileTextOutlined
                        style={{ color: "var(--primary-brand)" }}
                      />
                      <Text
                        style={{
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {doc.name}
                      </Text>
                    </Space>
                    <Button
                      type="link"
                      icon={<LinkOutlined />}
                      href={doc.url}
                      target="_blank"
                      style={{ color: "var(--primary-brand)", padding: 0 }}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Form>
    </Drawer>
  );
};
