import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Row,
  Col,
  message,
  Upload,
  Image,
} from "antd";
import {
  UserAddOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { useParams } from "react-router-dom";
import { getCookie } from "../../helpers/cookies";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { GRADES } from "../../redux/schoolSlice";
import { createTeacher } from "../../redux/roaster/roasterSlice";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const SchoolOnboarding: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.roaster);
  const { schoolId } = useParams<{ schoolId: string }>();
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState("Student");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    const hideLoading = message.loading(
      "Creating candidate profile in database...",
      0,
    );

    try {
      const finalSchoolId = schoolId || "";
      const payload = {
        school_id: finalSchoolId,
        name: values.name,
        email: values.email,
        password: "TempPass@" + (values.phone || "1234567890"),
        phone: values.phone,
        role: values.role.toLowerCase(),
        is_admin: false,
        grade: values.role === "Student" ? values.grade : "N/A",
        subject: values.role === "Teacher" ? values.subject : "",
        department: values.role === "Staff" ? values.department : "",
        parent_contact:
          values.role === "Student"
            ? {
                name: values.parentName,
                email: values.parentEmail,
                phone: values.parentPhone,
              }
            : { name: "", email: "", phone: "" },
        documents: (values.documents || []).map((doc: any) => ({
          name: doc.name,
          url: doc.url,
          type: doc.type || "",
        })),
        experience: values.role === "Teacher" ? values.experience : "",
        qualification: values.role === "Teacher" ? values.qualification : "",
        address: values.address,
        city: values.city,
        state: values.state,
        country: values.country,
        dob: values.dob || "",
        status: values.status,
        alt_phone: values.altPhone || "",
        gender: values.gender || "",
      };

      if (values.role.toLowerCase() === "teacher") {
        dispatch(createTeacher(payload));
      }

      message.success(
        `Successfully onboarded ${values.name} as ${values.role} in database!`,
      );
      form.resetFields();
    } catch (err: any) {
      message.error(err.message || "An error occurred during onboarding.");
    } finally {
      hideLoading();
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            fontWeight: 700,
          }}
        >
          Student & Staff Onboarding
        </Title>
        <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Onboard new students, teachers, and staff members, check verification
          states, and update registration files.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <UserAddOutlined style={{ color: "#45a29e" }} />
                <span style={{ color: "var(--text-primary)" }}>
                  Onboard Student & Staff
                </span>
              </Space>
            }
            style={{ background: "var(--bg-container)", border: "1px solid var(--border-muted)" }}
          >
            <Form
              form={form}
              name="onboard_form"
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                role: "Student",
                grade: "Grade 10",
                status: "Pending",
                country: "India",
              }}
              requiredMark={false}
            >
              <Title level={5} style={{ color: "#45a29e", marginBottom: 16 }}>
                Basic Information
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="name"
                    label={<span style={{ color: "var(--text-secondary)" }}>Full Name</span>}
                    rules={[
                      { required: true, message: "Please input the name!" },
                    ]}
                  >
                    <Input
                      placeholder="e.g. John Doe"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-muted)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="email"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>Email Address</span>
                    }
                    rules={[
                      { required: true, message: "Please input the email!" },
                      { type: "email", message: "Please input a valid email!" },
                    ]}
                  >
                    <Input
                      placeholder="e.g. j.doe@school.edu"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-muted)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="phone"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>Phone Number</span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the phone number!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g. 9876543210"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-muted)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="role"
                    label={<span style={{ color: "var(--text-secondary)" }}>Role</span>}
                    rules={[{ required: true }]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      dropdownStyle={{ background: "var(--bg-elevated)" }}
                      onChange={(value) => setSelectedRole(value)}
                    >
                      <Option value="Student">Student</Option>
                      <Option value="Teacher">Teacher</Option>
                      <Option value="Staff">Staff Officer</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="altPhone"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        Alternative Phone
                      </span>
                    }
                  >
                    <Input
                      placeholder="e.g. 9876543211"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-muted)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Title
                level={5}
                style={{ color: "#45a29e", marginTop: 16, marginBottom: 16 }}
              >
                Address Details
              </Title>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="address"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>Street Address</span>
                    }
                    rules={[
                      { required: true, message: "Please input the address!" },
                    ]}
                  >
                    <Input
                      placeholder="e.g. 123 Main Street"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-muted)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item
                    name="city"
                    label={<span style={{ color: "var(--text-secondary)" }}>City</span>}
                    rules={[
                      { required: true, message: "Please input the city!" },
                    ]}
                  >
                    <Input
                      placeholder="e.g. Mumbai"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-muted)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item
                    name="state"
                    label={<span style={{ color: "var(--text-secondary)" }}>State</span>}
                    rules={[
                      { required: true, message: "Please input the state!" },
                    ]}
                  >
                    <Input
                      placeholder="e.g. Maharashtra"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-muted)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item
                    name="country"
                    label={<span style={{ color: "var(--text-secondary)" }}>Country</span>}
                    rules={[{ required: true }]}
                  >
                    <Input
                      placeholder="e.g. India"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-muted)",
                        color: "var(--text-primary)",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {selectedRole === "Student" && (
                <>
                  <Title
                    level={5}
                    style={{
                      color: "#45a29e",
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  >
                    Student & Parent Details
                  </Title>
                  <Row gutter={16}>
                    <Col xs={24} md={6}>
                      <Form.Item
                        name="grade"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Grade / Target
                          </span>
                        }
                        rules={[{ required: true }]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          dropdownStyle={{ background: "var(--bg-elevated)" }}
                        >
                          {GRADES.map((grade) => (
                            <Option key={grade} value={grade}>
                              {grade}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        name="dob"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Date of Birth
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input the date of birth!",
                          },
                        ]}
                      >
                        <Input
                          type="date"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                      <Form.Item
                        name="parentName"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>Parent Name</span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input parent's name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Parent Name"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                      <Form.Item
                        name="parentEmail"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>Parent Email</span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input parent's email!",
                          },
                          {
                            type: "email",
                            message: "Please input a valid email!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="parent@email.com"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                      <Form.Item
                        name="parentPhone"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>Parent Phone</span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input parent's phone number!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Parent Phone"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {selectedRole === "Teacher" && (
                <>
                  <Title
                    level={5}
                    style={{
                      color: "#45a29e",
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  >
                    Teacher Details
                  </Title>
                  <Row gutter={16}>
                    <Col xs={24} md={10}>
                      <Form.Item
                        name="subject"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Teaching Subject
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input subject name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g. Mathematics, Physics"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        name="experience"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Experience (Years)
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input experience!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g. 5"
                          type="number"
                          min={0}
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="qualification"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Highest Qualification
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input qualification!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g. B.Ed, M.Sc, PhD"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {selectedRole === "Staff" && (
                <>
                  <Title
                    level={5}
                    style={{
                      color: "#45a29e",
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  >
                    Staff Details
                  </Title>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="department"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>Department</span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input department name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g. Administration, Accounts"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              <Title
                level={5}
                style={{ color: "#45a29e", marginTop: 16, marginBottom: 16 }}
              >
                Supporting Documents
              </Title>
              <Form.List name="documents">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row
                        key={key}
                        gutter={16}
                        align="middle"
                        style={{ marginBottom: 12 }}
                      >
                        <Col xs={24} md={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing document name",
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="e.g. Birth Certificate, Transcript"
                              style={{
                                background: "var(--bg-elevated)",
                                border: "1px solid var(--border-muted)",
                                color: "var(--text-primary)",
                                borderRadius: 8,
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            dependencies={[
                              ["documents", name, "url"],
                              ["documents", name, "type"],
                              ["documents", name, "fileName"],
                            ]}
                          >
                            {() => {
                              const fileUrl = form.getFieldValue([
                                "documents",
                                name,
                                "url",
                              ]);
                              const fileType = form.getFieldValue([
                                "documents",
                                name,
                                "type",
                              ]);
                              const fileName = form.getFieldValue([
                                "documents",
                                name,
                                "fileName",
                              ]);
                              const isImage =
                                fileType?.startsWith("image/") ||
                                (typeof fileUrl === "string" &&
                                  /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl));

                              if (!fileUrl) return null;

                              return (
                                <div style={{ marginTop: 4, paddingLeft: 4 }}>
                                  <span
                                    style={{
                                      color: "var(--text-secondary)",
                                      fontSize: "12px",
                                    }}
                                  >
                                    File:{" "}
                                  </span>
                                  {isImage ? (
                                    <span
                                      onClick={() => setPreviewImage(fileUrl)}
                                      style={{
                                        color: "#45a29e",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                      title="Click to preview image"
                                    >
                                      {fileName || "Local File Preview"}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        color: "var(--text-secondary)",
                                        fontSize: "12px",
                                      }}
                                      title="Preview only available for images"
                                    >
                                      {fileName || "Local File"} (Preview not
                                      available)
                                    </span>
                                  )}
                                </div>
                              );
                            }}
                          </Form.Item>
                        </Col>
                        <Col xs={20} md={10}>
                          <Form.Item
                            noStyle
                            dependencies={[["documents", name, "url"]]}
                          >
                            {() => {
                              const fileUrl = form.getFieldValue([
                                "documents",
                                name,
                                "url",
                              ]);

                              return (
                                <Space
                                  align="center"
                                  size="middle"
                                  style={{ width: "100%" }}
                                >
                                  <Form.Item
                                    {...restField}
                                    name={[name, "url"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please upload the document",
                                      },
                                    ]}
                                    style={{ marginBottom: 0, display: "none" }}
                                  >
                                    <Input type="hidden" />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "type"]}
                                    style={{ marginBottom: 0, display: "none" }}
                                  >
                                    <Input type="hidden" />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "fileName"]}
                                    style={{ marginBottom: 0, display: "none" }}
                                  >
                                    <Input type="hidden" />
                                  </Form.Item>

                                  <Upload
                                    name="file"
                                    maxCount={1}
                                    showUploadList={false}
                                    beforeUpload={async (file) => {
                                      const msgKey = `upload_${name}`;
                                      message.loading({
                                        content: `Uploading ${file.name}...`,
                                        key: msgKey,
                                        duration: 0,
                                      });
                                      try {
                                        const token = getCookie("token");
                                        const formData = new FormData();
                                        formData.append("file", file);

                                        const res = await fetch(
                                          "http://localhost:8080/api/v1/upload",
                                          {
                                            method: "POST",
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                            body: formData,
                                          },
                                        );

                                        if (!res.ok) {
                                          const data = await res.json();
                                          throw new Error(
                                            data.error ||
                                              "Failed to upload file",
                                          );
                                        }

                                        const data = await res.json();
                                        form.setFieldValue(
                                          ["documents", name, "url"],
                                          data.url,
                                        );
                                        form.setFieldValue(
                                          ["documents", name, "type"],
                                          file.type,
                                        );
                                        form.setFieldValue(
                                          ["documents", name, "fileName"],
                                          file.name,
                                        );
                                        message.success({
                                          content: `${file.name} uploaded successfully.`,
                                          key: msgKey,
                                        });
                                      } catch (err: any) {
                                        message.error({
                                          content: `Upload failed: ${err.message}`,
                                          key: msgKey,
                                        });
                                      }
                                      return false;
                                    }}
                                  >
                                    <Button
                                      icon={<UploadOutlined />}
                                      style={{
                                        background: "var(--bg-elevated)",
                                        border: "1px solid var(--border-muted)",
                                        color: fileUrl ? "#45a29e" : "var(--text-secondary)",
                                        borderRadius: 8,
                                        textAlign: "left",
                                      }}
                                    >
                                      {fileUrl ? "Change File" : "Choose File"}
                                    </Button>
                                  </Upload>
                                </Space>
                              );
                            }}
                          </Form.Item>
                        </Col>
                        <Col
                          xs={4}
                          md={2}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <DeleteOutlined
                            onClick={() => remove(name)}
                            style={{
                              color: "#ef4444",
                              fontSize: 20,
                              cursor: "pointer",
                            }}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        size="small"
                        icon={<PlusOutlined />}
                        style={{
                          background: "transparent",
                          borderColor: "var(--border-muted)",
                          color: "#45a29e",
                          borderRadius: 6,
                          padding: "0 16px",
                        }}
                      >
                        Add Document
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Title
                level={5}
                style={{ color: "#45a29e", marginTop: 16, marginBottom: 16 }}
              >
                Status
              </Title>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="status"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>Initial Status</span>
                    }
                    rules={[{ required: true }]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      dropdownStyle={{ background: "var(--bg-elevated)" }}
                    >
                      <Option value="Pending">Pending Verification</Option>
                      <Option value="Verified">Documents Verified</Option>
                      <Option value="Enrolled">Fully Enrolled</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                style={{ marginBottom: 0, marginTop: 24, textAlign: "right" }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting || loading}
                  style={{
                    background: "#45a29e",
                    borderColor: "#45a29e",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontFamily: "var(--font-display)",
                    borderRadius: 8,
                    padding: "0 24px",
                  }}
                >
                  Onboard {selectedRole || "Candidate"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      {/* Lightbox Preview Component */}
      <div style={{ display: "none" }}>
        <Image
          src={previewImage || undefined}
          preview={{
            visible: !!previewImage,
            onVisibleChange: (visible) => {
              if (!visible) setPreviewImage(null);
            },
          }}
        />
      </div>
    </div>
  );
};
