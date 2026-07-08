import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Typography,
  Space,
  message,
  Table,
  Card,
  Tag,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchTeachers } from "../../redux/teachers/teachersSlice";
import { fetchGradesBySchool, createGradeStructure, updateGradeStructure } from "../../redux/roaster/roasterSlice";
import { api } from "../../api/api";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const GradesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { teachers } = useAppSelector((state) => state.teachers);
  const { currentUser, currentSchool, grades, loading, submitLoading } = useAppSelector(
    (state) => state.roaster,
  );

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const schoolId =
    currentUser?.school_id || currentSchool?.school_id || currentSchool?.id;

  useEffect(() => {
    if (schoolId) {
      dispatch(
        fetchTeachers({
          schoolId,
          page: 1,
          limit: 100,
        }),
      );
      dispatch(fetchGradesBySchool(schoolId));
    }
  }, [schoolId, dispatch]);

  const handleOpenModal = () => {
    setEditingGrade(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGrade(null);
    form.resetFields();
  };

  const handleRowClick = (record: any) => {
    setEditingGrade(record);
    setIsModalOpen(true);
    form.setFieldsValue({
      gradeName: record.name,
      fees: record.tuition_fee,
      subjects: record.subjects && record.subjects.length > 0
        ? record.subjects.map((subj: any) => ({
            name: subj.name,
            teacherId: subj.teacher_id || subj.teacherId,
          }))
        : [{ name: "", teacherId: undefined }],
    });
  };

  const handleDelete = async (gradeId: string) => {
    try {
      await api.delete(`/api/v1/grades/${gradeId}`);
      message.success("Grade structure deleted successfully");
      if (schoolId) {
        dispatch(fetchGradesBySchool(schoolId));
      }
    } catch (err: any) {
      message.error(
        err.response?.data?.error ||
          err.message ||
          "Failed to delete grade structure",
      );
    }
  };

  const onFinish = async (values: any) => {
    if (!schoolId) {
      message.error("School ID is missing");
      return;
    }

    const presetColors = [
      "#45a29e",
      "#ffa552",
      "#f85149",
      "#2ea043",
      "#a370f7",
      "#38bdf8",
      "#ec4899",
    ];
    const randomColor = editingGrade?.color ||
      presetColors[Math.floor(Math.random() * presetColors.length)];

    const mappedSubjects = (values.subjects || []).map((subj: any) => {
      const assignedTeacher = teachers.find((t) => t.id === subj.teacherId);
      return {
        name: subj.name,
        teacher_id: subj.teacherId,
        teacher_name: assignedTeacher ? assignedTeacher.name : "Unassigned",
        description: "",
      };
    });

    let resultAction;
    if (editingGrade) {
      resultAction = await dispatch(
        updateGradeStructure({
          id: editingGrade.id,
          name: values.gradeName,
          color: randomColor,
          tuition_fee: Number(values.fees),
          subjects: mappedSubjects,
        })
      );
    } else {
      resultAction = await dispatch(
        createGradeStructure({
          school_id: schoolId,
          name: values.gradeName,
          color: randomColor,
          tuition_fee: Number(values.fees),
          subjects: mappedSubjects,
        })
      );
    }

    const isSuccess = editingGrade
      ? updateGradeStructure.fulfilled.match(resultAction)
      : createGradeStructure.fulfilled.match(resultAction);

    if (isSuccess) {
      message.success(
        `Successfully ${editingGrade ? "updated" : "structured"} Grade "${values.gradeName}"!`
      );
      handleCloseModal();
      dispatch(fetchGradesBySchool(schoolId));
    } else {
      const errorMsg = resultAction.payload as string || `Failed to ${editingGrade ? "update" : "structure"} grade`;
      message.error(errorMsg);
    }
  };

  const columns = [
    {
      title: "Grade Level",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: any) => (
        <Space>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: record.color || "#45a29e",
            }}
          />
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {name}
          </span>
        </Space>
      ),
    },
    {
      title: "Annual Tuition Fees",
      dataIndex: "tuition_fee",
      key: "tuition_fee",
      render: (fees: number) => (
        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          ₹{fees ? fees.toLocaleString("en-IN") : "0"}
        </span>
      ),
    },
    {
      title: "Subjects & Assigned Teachers",
      dataIndex: "subjects",
      key: "subjects",
      render: (subjects: any[]) => {
        if (!subjects || subjects.length === 0) {
          return (
            <span style={{ color: "var(--text-secondary)" }}>
              No subjects configured
            </span>
          );
        }
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {subjects.map((subj, idx) => (
              <Tag
                key={idx}
                style={{
                  background: "rgba(69, 162, 158, 0.08)",
                  border: "1px solid rgba(69, 162, 158, 0.25)",
                  color: "#45a29e",
                  borderRadius: 6,
                  padding: "4px 8px",
                }}
              >
                <strong>{subj.name}</strong>:{" "}
                {subj.teacher_name || subj.teacherName || "Unassigned"}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt: string) => {
        if (!createdAt) return "—";
        const date = new Date(createdAt);
        return (
          <span style={{ color: "var(--text-secondary)" }}>
            {date.toLocaleDateString()}{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center" as const,
      render: (_: any, record: any) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Delete Grade Structure"
            description="Are you sure you want to delete this grade structure?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
              }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

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
            Grades Structuring & Fees
          </Title>
          <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            Configure and manage school grade structures, associated fees, and
            subject teacher assignments.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
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
          Add Grade Structure
        </Button>
      </div>

      <Card
        title={
          <Space>
            <BookOutlined style={{ color: "#45a29e" }} />
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              Structured Grades Directory
            </span>
          </Space>
        }
        style={{
          background: "var(--bg-container)",
          border: "1px solid var(--border-muted)",
          borderRadius: 12,
        }}
      >
        <Table
          dataSource={grades.map((g) => ({ ...g, key: g.id }))}
          columns={columns}
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: grades.length,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          scroll={{ x: true }}
          style={{ background: "transparent" }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Drawer
        title={
          <span
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
            }}
          >
            {editingGrade ? "Update Grade Structure" : "Configure New Grade Structure"}
          </span>
        }
        placement="right"
        width={550}
        onClose={handleCloseModal}
        open={isModalOpen}
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
              onClick={handleCloseModal}
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
              loading={submitLoading}
              style={{
                background: "#45a29e",
                borderColor: "#45a29e",
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                color: "#ffffff",
              }}
            >
              {editingGrade ? "Update Grade Structure" : "Save Grade Structure"}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            subjects: [{ name: "", teacherId: undefined }],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gradeName"
                label={
                  <span
                    style={{ color: "var(--text-secondary)", fontWeight: 500 }}
                  >
                    Grade Level
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter a grade level" },
                ]}
              >
                <Input
                  placeholder="e.g. Grade 1"
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
                name="fees"
                label={
                  <span
                    style={{ color: "var(--text-secondary)", fontWeight: 500 }}
                  >
                    Annual Tuition Fees (₹)
                  </span>
                }
                rules={[{ required: true, message: "Please enter grade fees" }]}
              >
                <Input
                  type="number"
                  placeholder="e.g. 25000"
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

          <div
            style={{
              borderTop: "1px solid var(--border-muted)",
              margin: "16px 0",
            }}
          />

          <Title level={5} style={{ color: "#45a29e", marginBottom: 12 }}>
            Subjects & Assigned Teachers
          </Title>

          <Form.List name="subjects">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row
                    key={key}
                    gutter={16}
                    align="middle"
                    style={{ marginBottom: 12 }}
                  >
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[
                          { required: true, message: "Enter subject name" },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input
                          placeholder="Subject Name (e.g. Science)"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-muted)",
                            color: "var(--text-primary)",
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        name={[name, "teacherId"]}
                        rules={[
                          { required: true, message: "Assign a teacher" },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Select
                          placeholder="Assign Teacher"
                          dropdownStyle={{ background: "var(--bg-elevated)" }}
                        >
                          {teachers.map((t) => (
                            <Option key={t.id} value={t.id}>
                              {t.name} ({t.subject || "Teacher"})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{ textAlign: "center" }}>
                      <DeleteOutlined
                        onClick={() => remove(name)}
                        style={{
                          color: "#ef4444",
                          fontSize: 18,
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
                    icon={<PlusOutlined />}
                    style={{
                      width: "100%",
                      borderColor: "var(--border-muted)",
                      color: "#45a29e",
                      borderRadius: 8,
                    }}
                  >
                    Add Subject
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Drawer>
    </div>
  );
};

export default GradesPage;
