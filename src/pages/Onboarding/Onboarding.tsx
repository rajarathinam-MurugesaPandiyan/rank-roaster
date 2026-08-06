import React, { useState, useEffect } from "react";
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
  Switch,
  Avatar,
} from "antd";
import {
  UserAddOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  CameraOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  createTeacher,
  fetchGradesBySchool,
} from "../../redux/roaster/roasterSlice";
import { createStudent } from "../../redux/students/studentsSlice";
import { fetchAcademicYearsBySchool } from "../../redux/academic/academicSlice";
import { ImageCropModal } from "../../components/ImageCropModal";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const SchoolOnboarding: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, grades = [] } = useAppSelector((state) => state.roaster);
  const { academicYears = [] } = useAppSelector((state) => state.academic);
  const { schoolId } = useParams<{ schoolId: string }>();
  const [form] = Form.useForm();
  const selectedGradeId = Form.useWatch("grade", form);
  const selectedGradeObj = (grades as any[]).find(
    (g) => g.id === selectedGradeId || g.name === selectedGradeId
  );
  const availableSections: string[] = (selectedGradeObj?.sections || []).map(
    (sec: any) => (typeof sec === "string" ? sec : sec.name)
  );
  const [selectedRole, setSelectedRole] = useState("Student");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Profile photo state
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const [profilePhotoKey, setProfilePhotoKey] = useState<string>("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("avatar.png");

  const handleProfilePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error(
        "Please select a valid picture file (PNG, JPEG, WEBP, etc.)",
      );
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      message.error("Picture size exceeds 12MB limit!");
      return;
    }
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveProfilePhoto = async () => {
    if (profilePhotoKey) {
      try {
        await axios.delete(
          `http://localhost:8080/public/documents/delete?key=${encodeURIComponent(profilePhotoKey)}`,
        );
      } catch (e) {
        console.error("Failed to delete photo from storage", e);
      }
    }
    setProfilePhotoUrl("");
    setProfilePhotoKey("");
    form.setFieldValue("photoUrl", "");
    message.info("Profile photo removed.");
  };

  useEffect(() => {
    if (schoolId) {
      dispatch(fetchGradesBySchool(schoolId));
      dispatch(fetchAcademicYearsBySchool(schoolId));
    }
  }, [schoolId, dispatch]);

  const activeYear = academicYears.find((ay) => ay.isActive);

  useEffect(() => {
    if (activeYear) {
      form.setFieldsValue({
        academicYearId: activeYear.id,
      });
    }
  }, [activeYear, form]);

  useEffect(() => {
    if (grades && grades.length > 0) {
      const currentGrade = form.getFieldValue("grade");
      const foundGrade = (grades as any[]).find(
        (g) => g.id === currentGrade || g.name === currentGrade
      );
      const activeGrade = foundGrade || grades[0];
      if (!foundGrade && activeGrade) {
        form.setFieldValue("grade", activeGrade.id);
      }
      const secs: string[] = (activeGrade?.sections || []).map((sec: any) =>
        typeof sec === "string" ? sec : sec.name
      );
      const currentSection = form.getFieldValue("section");
      if (secs.length > 0 && (!currentSection || !secs.includes(currentSection))) {
        form.setFieldValue("section", secs[0]);
      }
    }
  }, [grades, selectedGradeId, form]);

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
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        password: "TempPass@" + (values.phone || "1234567890"),
        phone: values.phone,
        image_url: profilePhotoUrl,
        role: values.role.toLowerCase(),
        is_admin: values.role === "Teacher" ? !!values.is_admin : false,
        grade: values.role === "Student" ? values.grade : "N/A",
        subject: values.role === "Teacher" ? values.subject : "",
        department: values.role === "Staff" ? values.department : "",
        parent_contact:
          values.role === "Student"
            ? {
                name: values.fatherName || values.motherName || "",
                email: values.fatherEmail || values.motherEmail || "",
                phone: values.fatherPhone || values.motherPhone || "",
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
        total_fees:
          values.role === "Student" ? Number(values.totalFees || 0) : 0,
        fees_paid: values.role === "Student" ? Number(values.feesPaid || 0) : 0,
        remaining_fees:
          values.role === "Student"
            ? Math.max(
                0,
                Number(values.totalFees || 0) - Number(values.feesPaid || 0),
              )
            : 0,
      };

      if (values.role.toLowerCase() === "student") {
        const firstName = values.firstName || "";
        const lastName = values.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();

        const dobDate = new Date(values.dob);
        const dobISO = dobDate.toISOString();

        const totalFees = Number(values.totalFees || 0);
        const feesPaid = Number(values.feesPaid || 0);
        const remainingFees = Math.max(0, totalFees - feesPaid);

        const studentPayload = {
          schoolId: finalSchoolId,
          gradeId: values.grade,
          admissionNo: values.admissionNo || "",
          rollNo: values.rollNo || "",
          firstName: firstName,
          lastName: lastName,
          gender: values.gender,
          dateOfBirth: dobISO,
          email: values.email,
          phone: values.phone,
          fatherName: values.fatherName,
          fatherPhone: values.fatherPhone,
          fatherEmail: values.fatherEmail || "",
          motherName: values.motherName,
          motherPhone: values.motherPhone,
          motherEmail: values.motherEmail || "",
          guardianName: values.guardianName || "",
          guardianPhone: values.guardianPhone || "",
          guardianEmail: values.guardianEmail || "",
          guardianRelation: values.guardianRelation || "",
          address: values.address,
          bloodGroup: values.bloodGroup || "",
          photoUrl: profilePhotoUrl,
          documents: (values.documents || []).map((doc: any) => ({
            name: doc.name,
            url: doc.url,
            type: doc.type || "",
          })),
          status: "Active",
          joinedAt: new Date().toISOString(),
          password: "TempPass@" + (values.phone || "1234567890"),
          academicYearId: values.academicYearId,
          section: values.section,
          totalFees: totalFees,
          feesPaid: feesPaid,
          remainingFees: remainingFees,
        };

        const resultAction = await dispatch(createStudent(studentPayload));
        if (createStudent.fulfilled.match(resultAction)) {
          message.success(
            `Successfully onboarded student ${fullName} in database!`,
          );
          form.resetFields();
          setProfilePhotoUrl("");
          setProfilePhotoKey("");
        } else {
          const errorMsg =
            (resultAction.payload as string) || "Failed to onboard student";
          message.error(errorMsg);
        }
      } else if (values.role.toLowerCase() === "teacher") {
        const resultAction = await dispatch(createTeacher(payload));
        if (createTeacher.fulfilled.match(resultAction)) {
          message.success(
            `Successfully onboarded teacher ${values.name} as teacher in database!`,
          );
          form.resetFields();
          setProfilePhotoUrl("");
          setProfilePhotoKey("");
        } else {
          const errorMsg =
            (resultAction.payload as string) || "Failed to onboard teacher";
          message.error(errorMsg);
        }
      } else {
        message.success(
          `Successfully onboarded ${values.name} as ${values.role} in database!`,
        );
        form.resetFields();
      }
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
            style={{
              background: "var(--bg-container)",
              border: "1px solid var(--border-muted)",
            }}
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
                is_admin: false,
              }}
              requiredMark={false}
            >
              {/* Profile Photo Section with Crop & Live Preview */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 24,
                  padding: 16,
                  background: "var(--bg-elevated)",
                  borderRadius: 12,
                  border: "1px solid var(--border-muted)",
                }}
              >
                <Avatar
                  key={profilePhotoUrl || "empty-avatar"}
                  size={80}
                  src={profilePhotoUrl || undefined}
                  icon={!profilePhotoUrl ? <UserOutlined /> : undefined}
                  style={{
                    backgroundColor: "var(--primary-brand)",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                  }}
                />
                <div>
                  <Title
                    level={5}
                    style={{ margin: 0, color: "var(--text-primary)" }}
                  >
                    Profile Photo
                  </Title>
                  <Paragraph
                    style={{
                      color: "var(--text-secondary)",
                      margin: "4px 0 12px 0",
                      fontSize: 13,
                    }}
                  >
                    Upload a high-resolution PNG or JPEG picture (Max size:
                    12MB). You will be prompted with a crop preview before
                    uploading.
                  </Paragraph>
                  <Space wrap>
                    <label
                      htmlFor="profile-photo-input"
                      style={{
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        background: "var(--primary-brand)",
                        color: "#fff",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      <CameraOutlined />{" "}
                      {profilePhotoUrl ? "Change Photo" : "Upload & Crop Photo"}
                    </label>
                    <input
                      id="profile-photo-input"
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      style={{ display: "none" }}
                      onChange={handleProfilePhotoSelect}
                    />

                    {profilePhotoUrl && (
                      <>
                        <Button
                          icon={<EyeOutlined />}
                          onClick={() => setPreviewImage(profilePhotoUrl)}
                          style={{ borderRadius: 8 }}
                        >
                          Preview Photo
                        </Button>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={handleRemoveProfilePhoto}
                          style={{ borderRadius: 8 }}
                        >
                          Remove Photo
                        </Button>
                      </>
                    )}
                  </Space>
                </div>
              </div>

              <Title level={5} style={{ color: "#45a29e", marginBottom: 16 }}>
                Basic Information
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="firstName"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        First Name
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the first name!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g. John"
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
                    name="lastName"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        Last Name
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input the last name!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g. Doe"
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
                    name="email"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        Email Address
                      </span>
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
                <Col xs={24} md={6}>
                  <Form.Item
                    name="phone"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        Phone Number
                      </span>
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
                <Col xs={24} md={8}>
                  <Form.Item
                    name="role"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        Role
                      </span>
                    }
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
                <Col xs={24} md={8}>
                  <Form.Item
                    name="gender"
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        Gender
                      </span>
                    }
                    rules={[
                      { required: true, message: "Please select the gender!" },
                    ]}
                  >
                    <Select
                      placeholder="Select Gender"
                      style={{ width: "100%" }}
                      dropdownStyle={{ background: "var(--bg-elevated)" }}
                    >
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
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
                      <span style={{ color: "var(--text-secondary)" }}>
                        Street Address
                      </span>
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
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        City
                      </span>
                    }
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
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        State
                      </span>
                    }
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
                    label={
                      <span style={{ color: "var(--text-secondary)" }}>
                        Country
                      </span>
                    }
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
                    Student Details
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
                        rules={[
                          { required: true, message: "Please select a grade!" },
                        ]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          dropdownStyle={{ background: "var(--bg-elevated)" }}
                          onChange={(val) => {
                            const foundGrade = (grades as any[]).find(
                              (g) => g.id === val || g.name === val
                            );
                            const secs: string[] = (foundGrade?.sections || []).map(
                              (sec: any) => (typeof sec === "string" ? sec : sec.name)
                            );
                            if (secs.length > 0) {
                              form.setFieldValue("section", secs[0]);
                            } else {
                              form.setFieldValue("section", "");
                            }
                          }}
                        >
                          {grades.map((grade: any) => (
                            <Option key={grade.id} value={grade.id}>
                              <Space>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: grade.color || "#45a29e",
                                  }}
                                />
                                <span>{grade.name}</span>
                              </Space>
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
                    <Col xs={24} md={6}>
                      <Form.Item
                        name="admissionNo"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Admission Number
                          </span>
                        }
                      >
                        <Input
                          placeholder="e.g. ADM1001"
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
                        name="rollNo"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Roll Number
                          </span>
                        }
                      >
                        <Input
                          type="number"
                          placeholder="e.g. 15"
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
                    <Col xs={24} md={6}>
                      <Form.Item
                        name="bloodGroup"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Blood Group
                          </span>
                        }
                      >
                        <Input
                          placeholder="e.g. O+"
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
                        name="academicYearId"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Academic Year
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please select academic year!",
                          },
                        ]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          dropdownStyle={{ background: "var(--bg-elevated)" }}
                          placeholder="Select Academic Year"
                        >
                          {academicYears.map((ay: any) => (
                            <Option key={ay.id} value={ay.id}>
                              {ay.name} ({ay.academicYear})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        name="section"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Section
                          </span>
                        }
                        rules={[
                          { required: true, message: "Please select or input Section!" },
                        ]}
                      >
                        {availableSections.length > 0 ? (
                          <Select
                            placeholder="Select Section"
                            allowClear
                            dropdownStyle={{ background: "var(--bg-elevated)" }}
                          >
                            {availableSections.map((sec: string) => (
                              <Option key={sec} value={sec}>
                                Section {sec}
                              </Option>
                            ))}
                          </Select>
                        ) : (
                          <Input
                            placeholder="e.g. A"
                            style={{
                              background: "var(--bg-elevated)",
                              border: "1px solid var(--border-muted)",
                              color: "var(--text-primary)",
                              borderRadius: 8,
                            }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Title
                    level={5}
                    style={{
                      color: "#45a29e",
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  >
                    Father Details
                  </Title>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="fatherName"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Father's Name
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input father's name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Father's Name"
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
                        name="fatherPhone"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Father's Phone
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input father's phone number!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Father's Phone"
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
                        name="fatherEmail"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Father's Email
                          </span>
                        }
                        rules={[
                          {
                            type: "email",
                            message: "Please input a valid email!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="father@email.com"
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
                    style={{
                      color: "#45a29e",
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  >
                    Mother Details
                  </Title>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="motherName"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Mother's Name
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input mother's name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Mother's Name"
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
                        name="motherPhone"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Mother's Phone
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input mother's phone number!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Mother's Phone"
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
                        name="motherEmail"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Mother's Email
                          </span>
                        }
                        rules={[
                          {
                            type: "email",
                            message: "Please input a valid email!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="mother@email.com"
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
                    style={{
                      color: "#45a29e",
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  >
                    Guardian Details (Optional)
                  </Title>
                  <Row gutter={16}>
                    <Col xs={24} md={6}>
                      <Form.Item
                        name="guardianName"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Guardian's Name
                          </span>
                        }
                      >
                        <Input
                          placeholder="Guardian's Name"
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
                        name="guardianPhone"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Guardian's Phone
                          </span>
                        }
                      >
                        <Input
                          placeholder="Guardian's Phone"
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
                        name="guardianEmail"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Guardian's Email
                          </span>
                        }
                        rules={[
                          {
                            type: "email",
                            message: "Please input a valid email!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="guardian@email.com"
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
                        name="guardianRelation"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Guardian Relation
                          </span>
                        }
                      >
                        <Input
                          placeholder="e.g. Uncle, Aunt"
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
                    style={{
                      color: "#45a29e",
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  >
                    Fee Structure & Payments
                  </Title>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="totalFees"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Total Fee Amount (₹)
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input total fee amount!",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder="e.g. 15000"
                          min={0}
                          onChange={() => {
                            const tot = Number(
                              form.getFieldValue("totalFees") || 0,
                            );
                            const paid = Number(
                              form.getFieldValue("feesPaid") || 0,
                            );
                            const rem = Math.max(0, tot - paid);
                            form.setFieldValue("remainingFees", rem);
                          }}
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
                        name="feesPaid"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Fees Paid (₹)
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input fees paid!",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder="e.g. 5000"
                          min={0}
                          onChange={() => {
                            const tot = Number(
                              form.getFieldValue("totalFees") || 0,
                            );
                            const paid = Number(
                              form.getFieldValue("feesPaid") || 0,
                            );
                            const rem = Math.max(0, tot - paid);
                            form.setFieldValue("remainingFees", rem);
                          }}
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
                        name="remainingFees"
                        label={
                          <span style={{ color: "var(--text-secondary)" }}>
                            Remaining Amount to be Paid (₹)
                          </span>
                        }
                      >
                        <Input
                          type="number"
                          placeholder="Remaining Amount"
                          readOnly
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "#ffa552",
                            fontWeight: 600,
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
                  <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col xs={24} md={6}>
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
                          <span style={{ color: "var(--text-secondary)" }}>
                            Department
                          </span>
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
                                          "http://localhost:8080/public/documents/upload",
                                          {
                                            method: "POST",
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
                                        color: fileUrl
                                          ? "#45a29e"
                                          : "var(--text-secondary)",
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
                      <span style={{ color: "var(--text-secondary)" }}>
                        Initial Status
                      </span>
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

      {/* Image Crop Modal */}
      <ImageCropModal
        open={cropModalOpen}
        imageSrc={rawImageSrc}
        fileName={selectedFileName}
        onCancel={() => setCropModalOpen(false)}
        onCropComplete={(result) => {
          setProfilePhotoUrl(result.url);
          setProfilePhotoKey(result.file_key);
          form.setFieldValue("photoUrl", result.url);
          setCropModalOpen(false);
        }}
      />
    </div>
  );
};
