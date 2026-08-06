import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  message,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { addClass, GRADES } from "../../redux/schoolSlice";

import { ClassCard } from "../../molecules/ClassCard";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const SchoolClasses: React.FC = () => {
  const dispatch = useAppDispatch();
  const { classes } = useAppSelector((state) => state.school);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    dispatch(
      addClass({
        className: values.className,
        grade: values.grade,
        teacher: values.teacher,
        schedule: values.schedule,
      }),
    );
    message.success(`Successfully added class "${values.className}"!`);
    handleCloseModal();
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.className.toLowerCase().includes(searchText.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchText.toLowerCase()) ||
      cls.grade.toLowerCase().includes(searchText.toLowerCase()),
  );

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
            Curriculum Classes
          </Title>
          <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            Explore academic courses, schedules, assigned teachers, and class
            enrollment rosters.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
          style={{
            background: "var(--primary-brand)",
            borderColor: "var(--primary-brand)",
            color: "#ffffff",
            fontWeight: 600,
            fontFamily: "var(--font-display)",
            borderRadius: 8,
            height: 40,
          }}
        >
          Add New Class
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ maxWidth: 400, marginBottom: 24 }}>
        <Input
          placeholder="Search classes by name, teacher, or grade..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }} />}
          style={{
            background: "var(--bg-container)",
            border: "1px solid var(--border-muted)",
            color: "var(--text-primary)",
            borderRadius: 8,
            height: 40,
          }}
        />
      </div>

      {/* Grid of Class Cards using ClassCard Molecule */}
      <Row gutter={[24, 24]}>
        {filteredClasses.map((cls) => (
          <Col xs={24} sm={12} md={8} lg={6} key={cls.id}>
            <ClassCard cls={cls} />
          </Col>
        ))}

        {filteredClasses.length === 0 && (
          <Col span={24}>
            <Card
              style={{
                background: "var(--bg-container)",
                border: "1px solid var(--border-muted)",
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              <Paragraph style={{ color: "var(--text-secondary)", margin: 0 }}>
                No classes match your search query.
              </Paragraph>
            </Card>
          </Col>
        )}
      </Row>

      {/* Add Class Modal (Elevated Slate Background) */}
      <Modal
        title={
          <span
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            Create New Course
          </span>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        style={{ borderRadius: 8 }}
        bodyStyle={{ background: "var(--bg-elevated)" }} // Elevated Slate
      >
        <Form
          form={form}
          name="add_class_form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            grade: "Grade 10",
          }}
          requiredMark={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="className"
            label={
              <span style={{ color: "var(--text-secondary)" }}>
                Class Title
              </span>
            }
            rules={[
              { required: true, message: "Please input the class name!" },
            ]}
          >
            <Input
              placeholder="e.g. Intro to Astrophysics"
              style={{
                background: "var(--bg-container)",
                border: "1px solid var(--border-muted)",
                color: "var(--text-primary)",
              }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="grade"
                label={
                  <span style={{ color: "var(--text-secondary)" }}>
                    Grade Level
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
            <Col span={12}>
              <Form.Item
                name="teacher"
                label={
                  <span style={{ color: "var(--text-secondary)" }}>
                    Instructor Name
                  </span>
                }
                rules={[
                  { required: true, message: "Please input the teacher name!" },
                ]}
              >
                <Input
                  placeholder="e.g. Dr. Jane Goodall"
                  style={{
                    background: "var(--bg-container)",
                    border: "1px solid var(--border-muted)",
                    color: "var(--text-primary)",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="schedule"
            label={
              <span style={{ color: "var(--text-secondary)" }}>
                Schedule Details
              </span>
            }
            rules={[
              { required: true, message: "Please input schedule details!" },
            ]}
          >
            <Input
              placeholder="e.g. Mon/Wed/Fri 10:00 AM"
              style={{
                background: "var(--bg-container)",
                border: "1px solid var(--border-muted)",
                color: "var(--text-primary)",
              }}
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0, marginTop: 24, textAlign: "right" }}
          >
            <Space>
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
                htmlType="submit"
                style={{
                  background: "var(--primary-brand)",
                  borderColor: "var(--primary-brand)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  borderRadius: 8,
                }}
              >
                Create Class
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
