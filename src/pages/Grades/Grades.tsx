import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Spin,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  fetchAcademicYearsBySchool,
  createAcademicYear,
  updateAcademicYear,
  type AcademicYearItem,
} from "../../redux/academic/academicSlice";

const { Title, Paragraph, Text } = Typography;

export const SchoolGrades: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { schoolId } = useParams<{ schoolId: string }>();
  const [form] = Form.useForm();

  const { academicYears, loading, submitLoading, error } = useAppSelector(
    (state) => state.academic
  );
  const { currentUser, currentSchool } = useAppSelector(
    (state) => state.roaster
  );

  const finalSchoolId =
    schoolId || currentUser?.school_id || currentSchool?.school_id || currentSchool?.id || "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYearItem | null>(null);

  // Fetch academic years on mount
  useEffect(() => {
    if (finalSchoolId) {
      dispatch(fetchAcademicYearsBySchool(finalSchoolId));
    }
  }, [finalSchoolId, dispatch]);

  // Handle display error notifications
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleOpenModal = (year: AcademicYearItem | null = null) => {
    setEditingYear(year);
    if (year) {
      form.setFieldsValue({
        name: year.name,
        academicYear: year.academicYear,
        startDate: year.startDate ? year.startDate.substring(0, 10) : "",
        endDate: year.endDate ? year.endDate.substring(0, 10) : "",
        isActive: year.isActive,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        isActive: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingYear(null);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    if (!finalSchoolId) {
      message.error("School context is missing");
      return;
    }

    try {
      const startIso = new Date(values.startDate).toISOString();
      const endIso = new Date(values.endDate).toISOString();

      if (editingYear) {
        // Update operation
        const resultAction = await dispatch(
          updateAcademicYear({
            id: editingYear.id,
            name: values.name,
            academicYear: values.academicYear,
            startDate: startIso,
            endDate: endIso,
            isActive: values.isActive,
          })
        );
        if (updateAcademicYear.fulfilled.match(resultAction)) {
          message.success(`Successfully updated Academic Year: ${values.name}`);
          handleCloseModal();
        }
      } else {
        // Create operation
        const resultAction = await dispatch(
          createAcademicYear({
            schoolId: finalSchoolId,
            name: values.name,
            academicYear: values.academicYear,
            startDate: startIso,
            endDate: endIso,
            isActive: values.isActive,
          })
        );
        if (createAcademicYear.fulfilled.match(resultAction)) {
          message.success(`Successfully created Academic Year: ${values.name}`);
          handleCloseModal();
        }
      }
    } catch (err: any) {
      message.error(err.message || "An error occurred");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              fontWeight: 700,
            }}
          >
            Academic Calendar Years
          </Title>
          <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            Manage school academic calendar terms, configuration schedules, and active academic years.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal(null)}
          style={{
            background: "#45a29e",
            borderColor: "#45a29e",
            color: "#ffffff",
            fontWeight: 600,
            fontFamily: "var(--font-display)",
            borderRadius: 8,
            height: 40,
          }}
        >
          Create Academic Year
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Spin size="large" />
        </div>
      ) : academicYears.length === 0 ? (
        <Card
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "var(--bg-container)",
            border: "1px solid var(--border-muted)",
            borderRadius: 12,
          }}
        >
          <CalendarOutlined style={{ fontSize: 48, color: "var(--text-secondary)", marginBottom: 16 }} />
          <Title level={4} style={{ margin: 0, color: "var(--text-primary)" }}>
            No Academic Years Configured
          </Title>
          <Paragraph style={{ color: "var(--text-secondary)", marginTop: 8, marginBottom: 24 }}>
            You haven't setup any academic calendar terms yet. Click the button to configure the first academic term.
          </Paragraph>
          <Button
            type="primary"
            onClick={() => handleOpenModal(null)}
            style={{ background: "#45a29e", borderColor: "#45a29e", borderRadius: 6 }}
          >
            Get Started
          </Button>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {academicYears.map((ay) => (
            <Col xs={24} sm={12} md={8} key={ay.id}>
              <Card
                hoverable
                onClick={() => navigate(`/${finalSchoolId}/academic/${ay.id}/exams`)}
                style={{
                  background: "var(--bg-container)",
                  border: "1px solid var(--border-muted)",
                  borderRadius: 12,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ flex: 1, marginRight: 8 }}>
                    <Title level={4} style={{ margin: 0, color: "var(--text-primary)", fontWeight: 700 }}>
                      {ay.name}
                    </Title>
                    <Text style={{ color: "#ffa552", fontWeight: 600, fontSize: 13 }}>
                      Year Range: {ay.academicYear}
                    </Text>
                  </div>
                  <Space size={8} onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(ay);
                      }}
                      style={{
                        color: "var(--text-secondary)",
                        padding: 0,
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                    <div
                      style={{
                        background: ay.isActive ? "rgba(69, 162, 158, 0.12)" : "rgba(255, 255, 255, 0.05)",
                        border: ay.isActive ? "1px solid rgba(69, 162, 158, 0.3)" : "1px solid rgba(255, 255, 255, 0.15)",
                        color: ay.isActive ? "#45a29e" : "var(--text-secondary)",
                        borderRadius: 6,
                        padding: "4px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {ay.isActive ? "Active" : "Inactive"}
                    </div>
                  </Space>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-muted)",
                    borderRadius: 8,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                    <CheckCircleOutlined style={{ color: "#45a29e" }} />
                    <span>Start: {formatDate(ay.startDate)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                    <ClockCircleOutlined style={{ color: "#ffa552" }} />
                    <span>End: {formatDate(ay.endDate)}</span>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={
          <span
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {editingYear ? "Edit Academic Year Configuration" : "Configure New Academic Year"}
          </span>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="cancel"
            onClick={handleCloseModal}
            style={{
              background: "transparent",
              borderColor: "var(--border-muted)",
              color: "var(--text-secondary)",
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={submitLoading}
            style={{
              background: "#45a29e",
              borderColor: "#45a29e",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              color: "#ffffff",
            }}
          >
            {editingYear ? "Save Changes" : "Create Academic Year"}
          </Button>,
        ]}
        style={{ background: "transparent" }}
        modalRender={(modal) => (
          <div
            style={{
              background: "var(--bg-container)",
              border: "1px solid var(--border-muted)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {modal}
          </div>
        )}
      >
        <Form
          form={form}
          name="academic_year_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="name"
            label={<span style={{ color: "var(--text-secondary)" }}>Term Name</span>}
            rules={[{ required: true, message: "Please input the academic year term name!" }]}
          >
            <Input
              placeholder="e.g. Annual Academic Year 2025-26"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-muted)",
                color: "var(--text-primary)",
                borderRadius: 8,
              }}
            />
          </Form.Item>

          <Form.Item
            name="academicYear"
            label={<span style={{ color: "var(--text-secondary)" }}>Academic Year Range</span>}
            rules={[{ required: true, message: "Please input the academic year range!" }]}
          >
            <Input
              placeholder="e.g. 2025-2026"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-muted)",
                color: "var(--text-primary)",
                borderRadius: 8,
              }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label={<span style={{ color: "var(--text-secondary)" }}>Start Date</span>}
                rules={[{ required: true, message: "Please select start date!" }]}
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
            <Col span={12}>
              <Form.Item
                name="endDate"
                label={<span style={{ color: "var(--text-secondary)" }}>End Date</span>}
                rules={[{ required: true, message: "Please select end date!" }]}
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
          </Row>

          <Form.Item
            name="isActive"
            valuePropName="checked"
            label={<span style={{ color: "var(--text-secondary)" }}>Set as Active Year</span>}
          >
            <Switch checkedChildren="ACTIVE" unCheckedChildren="INACTIVE" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SchoolGrades;
