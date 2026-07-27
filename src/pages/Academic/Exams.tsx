import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Space,
  Input,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Select,
  Popconfirm,
  message,
  Spin,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  fetchExamsBySchool,
  createExam,
  deleteExam,
} from "../../redux/exam/examSlice";
import { fetchGradesBySchool } from "../../redux/roaster/roasterSlice";
import { fetchTeachers } from "../../redux/teachers/teachersSlice";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const generateObjectId = () => {
  return Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
};

export const AcademicExams: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { schoolId, academicYearId } = useParams<{
    schoolId?: string;
    academicYearId: string;
  }>();

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<
    string | undefined
  >(undefined);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const { academicYears } = useAppSelector((state) => state.academic);
  const { currentUser, currentSchool, grades } = useAppSelector(
    (state) => state.roaster,
  );
  const { teachers } = useAppSelector((state) => state.teachers);
  const { exams, loading, page, hasMore, submitLoading, error } =
    useAppSelector((state) => state.exam);

  const activeYear = academicYears.find((ay) => ay.id === academicYearId);
  const finalSchoolId =
    schoolId ||
    currentUser?.school_id ||
    currentSchool?.school_id ||
    currentSchool?.id ||
    "";

  // Fetch grades and teachers once on mount
  useEffect(() => {
    if (finalSchoolId) {
      dispatch(fetchGradesBySchool(finalSchoolId));
      dispatch(
        fetchTeachers({
          schoolId: finalSchoolId,
          page: 1,
          limit: 100,
        }),
      );
    }
  }, [finalSchoolId, dispatch]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Load first page of exams whenever filters change
  useEffect(() => {
    if (finalSchoolId) {
      dispatch(
        fetchExamsBySchool({
          schoolId: finalSchoolId,
          page: 1,
          limit: 6,
          search: debouncedSearch || undefined,
          gradeId: selectedGradeFilter || undefined,
          academicYearId: academicYearId || undefined,
        }),
      );
    }
  }, [
    finalSchoolId,
    debouncedSearch,
    selectedGradeFilter,
    academicYearId,
    dispatch,
  ]);

  // Infinite scroll listener using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          dispatch(
            fetchExamsBySchool({
              schoolId: finalSchoolId,
              page: page + 1,
              limit: 6,
              search: debouncedSearch || undefined,
              gradeId: selectedGradeFilter || undefined,
              academicYearId: academicYearId || undefined,
            }),
          );
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [
    dispatch,
    hasMore,
    loading,
    page,
    finalSchoolId,
    debouncedSearch,
    selectedGradeFilter,
    academicYearId,
  ]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleGradeChange = (gradeId: string) => {
    const selectedGrade = grades.find((g: any) => g.id === gradeId);
    if (selectedGrade && selectedGrade.subjects) {
      form.setFieldsValue({
        subjects: selectedGrade.subjects.map((sub: any) => ({
          subject_id: sub.id || sub.subject_id || generateObjectId(),
          name: sub.name,
          max_marks: 100,
          teacher_id: sub.teacher_id || sub.teacherId || "",
          teacher_name: sub.teacher_name || sub.teacherName || "",
        })),
      });
    } else {
      form.setFieldsValue({ subjects: [] });
    }
  };

  const onFinish = async (values: any) => {
    if (!finalSchoolId) {
      message.error("School context is missing");
      return;
    }
    if (!academicYearId) {
      message.error("Academic year context is missing");
      return;
    }

    try {
      const payload = {
        school_id: finalSchoolId,
        academic_year_id: academicYearId,
        grade_id: values.grade_id,
        name: values.name,
        subjects: (values.subjects || []).map((sub: any) => ({
          subject_id: sub.subject_id || generateObjectId(),
          name: sub.name,
          max_marks: Number(sub.max_marks),
          teacher_id: sub.teacher_id,
          teacher_name:
            teachers.find((t: any) => t.id === sub.teacher_id)?.name ||
            sub.teacher_name ||
            "",
        })),
      };

      const resultAction = await dispatch(createExam(payload));
      if (createExam.fulfilled.match(resultAction)) {
        message.success(`Successfully created exam: ${values.name}`);
        handleCloseModal();
        // Refresh page 1 to include the new exam
        dispatch(
          fetchExamsBySchool({
            schoolId: finalSchoolId,
            page: 1,
            limit: 6,
            search: debouncedSearch || undefined,
            gradeId: selectedGradeFilter || undefined,
            academicYearId: academicYearId || undefined,
          }),
        );
      } else {
        message.error(
          (resultAction.payload as string) || "Failed to create exam",
        );
      }
    } catch (err: any) {
      message.error(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const resultAction = await dispatch(deleteExam(id));
      if (deleteExam.fulfilled.match(resultAction)) {
        message.success("Exam deleted successfully");
        // If we delete the last item on the page, reload page 1 or let scroll handle
        if (exams.length <= 1) {
          dispatch(
            fetchExamsBySchool({
              schoolId: finalSchoolId,
              page: 1,
              limit: 6,
              search: debouncedSearch || undefined,
              gradeId: selectedGradeFilter || undefined,
              academicYearId: academicYearId || undefined,
            }),
          );
        }
      } else {
        message.error(
          (resultAction.payload as string) || "Failed to delete exam",
        );
      }
    } catch (err: any) {
      message.error(err.message || "Failed to delete exam");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ padding: 0, color: "#45a29e", marginBottom: 12 }}
          >
            Back to Academic Calendar
          </Button>
          <Title
            level={2}
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              fontWeight: 700,
            }}
          >
            Exams Schedule & Records
          </Title>
          <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {activeYear
              ? `Managing exam term schedules, supervision details, and classifications for ${activeYear.name} (${activeYear.academicYear}).`
              : "Managing exam term schedules, supervision details, and classifications."}
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
          size="large"
          style={{
            background: "#45a29e",
            borderColor: "#45a29e",
            borderRadius: 8,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(69, 162, 158, 0.2)",
          }}
        >
          Create Exam
        </Button>
      </div>

      <div
        style={{
          marginBottom: 24,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Input
          placeholder="Search by exam name or subject..."
          allowClear
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }} />}
          style={{
            background: "var(--bg-container)",
            border: "1px solid var(--border-muted)",
            color: "var(--text-primary)",
            borderRadius: 8,
            maxWidth: 350,
          }}
        />
        <Select
          placeholder="Filter by Grade"
          allowClear
          size="large"
          value={selectedGradeFilter}
          onChange={(val) => setSelectedGradeFilter(val)}
          style={{ minWidth: 200 }}
        >
          {grades.map((g: any) => (
            <Option key={g.id} value={g.id}>
              {g.name}
            </Option>
          ))}
        </Select>
      </div>

      {loading && page === 1 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "48px 0",
          }}
        >
          <Spin size="large" tip="Loading exams..." />
        </div>
      ) : exams.length === 0 ? (
        <Card
          style={{
            background: "var(--bg-container)",
            border: "1px solid var(--border-muted)",
            borderRadius: 12,
            textAlign: "center",
            padding: "48px 0",
          }}
        >
          <Empty
            description={
              <span style={{ color: "var(--text-secondary)" }}>
                No exams matched your filters.
              </span>
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              style={{ background: "#45a29e", borderColor: "#45a29e" }}
            >
              Create Exam
            </Button>
          </Empty>
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {exams.map((exam) => {
              const gradeObj = grades.find((g: any) => g.id === exam.grade_id);
              const gradeName = gradeObj ? gradeObj.name : "Unknown Grade";
              return (
                <Col xs={24} sm={12} lg={8} key={exam.id}>
                  <Card
                    hoverable
                    onClick={() =>
                      navigate(
                        `/${schoolId}/academic/${academicYearId}/exams/${exam.id}/results`
                      )
                    }
                    style={{
                      background: "var(--bg-container)",
                      border: "1px solid var(--border-muted)",
                      borderRadius: 12,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.3s ease",
                    }}
                    bodyStyle={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                    actions={[
                      <div
                        onClick={(e) => e.stopPropagation()}
                        key="delete-action"
                      >
                        <Popconfirm
                          title="Are you sure to delete this exam?"
                          onConfirm={(e) => {
                            e?.stopPropagation();
                            handleDelete(exam.id);
                          }}
                          onCancel={(e) => e?.stopPropagation()}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Space style={{ color: "#f85149", cursor: "pointer" }}>
                            <DeleteOutlined /> Delete
                          </Space>
                        </Popconfirm>
                      </div>,
                    ]}
                  >
                    <div style={{ flexGrow: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 16,
                        }}
                      >
                        <Space direction="vertical" size={2}>
                          <Text
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          >
                            Exam Structure
                          </Text>
                          <Title
                            level={4}
                            style={{
                              margin: 0,
                              color: "var(--text-primary)",
                              fontWeight: 700,
                            }}
                          >
                            {exam.name}
                          </Title>
                        </Space>
                        <Tag
                          color="blue"
                          style={{
                            borderRadius: 6,
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {gradeName}
                        </Tag>
                      </div>

                      <div style={{ marginTop: 16 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 12,
                            color: "var(--text-secondary)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: 8,
                            borderBottom: "1px solid var(--border-muted)",
                            paddingBottom: 4,
                          }}
                        >
                          Subjects ({exam.subjects?.length || 0})
                        </div>
                        {(exam.subjects || []).map((sub, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 0",
                              borderBottom:
                                idx !== exam.subjects.length - 1
                                  ? "1px solid var(--border-muted)"
                                  : "none",
                            }}
                          >
                            <div style={{ maxWidth: "70%" }}>
                              <Text
                                style={{
                                  color: "var(--text-primary)",
                                  fontWeight: 600,
                                  display: "block",
                                }}
                              >
                                <BookOutlined
                                  style={{
                                    marginRight: 6,
                                    color: "#45a29e",
                                  }}
                                />
                                {sub.name}
                              </Text>
                              <Text
                                type="secondary"
                                style={{ fontSize: 11, display: "block" }}
                              >
                                <UserOutlined style={{ marginRight: 4 }} />
                                {sub.teacher_name || "Unassigned"}
                              </Text>
                            </div>
                            <Tag
                              color="cyan"
                              style={{
                                borderRadius: 4,
                                margin: 0,
                                fontWeight: 500,
                              }}
                            >
                              {sub.max_marks} Marks
                            </Tag>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Infinite Scroll Trigger */}
          <div
            ref={observerRef}
            style={{
              margin: "32px 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading && page > 1 ? (
              <Spin tip="Loading more exams..." />
            ) : !hasMore && exams.length > 0 ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ✓ All exams loaded
              </Text>
            ) : null}
          </div>
        </>
      )}

      <Modal
        title={
          <Space>
            <CalendarOutlined style={{ color: "#45a29e" }} />
            <span>Create New Exam Package</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={650}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ subjects: [] }}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="Exam Name"
            rules={[{ required: true, message: "Please enter the exam name" }]}
          >
            <Input placeholder="e.g. First Term Exams, Final Exam" />
          </Form.Item>

          <Form.Item
            name="grade_id"
            label="Target Grade / Class"
            rules={[{ required: true, message: "Please select target grade" }]}
          >
            <Select placeholder="Select Grade" onChange={handleGradeChange}>
              {grades.map((g: any) => (
                <Option key={g.id} value={g.id}>
                  {g.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              Exam Subjects Configuration
            </Text>
            <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
              Auto-populated from the grade structure subjects. You can
              customize max marks or add/remove subjects.
            </Paragraph>
          </div>

          <Form.List name="subjects">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row
                    key={key}
                    gutter={12}
                    align="middle"
                    style={{ marginBottom: 12 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "subject_id"]}
                      style={{ display: "none" }}
                    >
                      <Input />
                    </Form.Item>

                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[
                          { required: true, message: "Subject name required" },
                        ]}
                        style={{ margin: 0 }}
                      >
                        <Input placeholder="Subject Name" />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "max_marks"]}
                        rules={[
                          { required: true, message: "Max marks required" },
                        ]}
                        style={{ margin: 0 }}
                      >
                        <Input placeholder="Max Marks" type="number" min={1} />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "teacher_id"]}
                        rules={[
                          {
                            required: true,
                            message: "Teacher selection required",
                          },
                        ]}
                        style={{ margin: 0 }}
                      >
                        <Select placeholder="Assign Teacher">
                          {teachers.map((t: any) => (
                            <Option key={t.id} value={t.id}>
                              {t.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={2} style={{ textAlign: "center" }}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                ))}

                <Form.Item style={{ marginTop: 8 }}>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        subject_id: generateObjectId(),
                        name: "",
                        max_marks: 100,
                        teacher_id: "",
                      })
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Custom Subject
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--border-muted)",
            }}
          >
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                style={{ background: "#45a29e", borderColor: "#45a29e" }}
              >
                Create Exam
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AcademicExams;
