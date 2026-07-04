import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Card,
  message,
  Space,
  Input,
  Select,
  Row,
  Col,
  Tag,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchTeachers, clearError } from "../../redux/teachers/teachersSlice";
import type { TeacherItem } from "../../redux/teachers/teachersSlice";
import { StatusTag } from "../../atoms/StatusTag";
import { TeacherDetailDrawer } from "./TeacherDetailDrawer";

const { Title, Paragraph } = Typography;

export const TeachersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { teachers, total, loading, error } = useAppSelector(
    (state) => state.teachers,
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(
    null,
  );

  const handleRowClick = (record: TeacherItem) => {
    setSelectedTeacher(record);
    setDrawerVisible(true);
  };

  const { currentUser, currentSchool } = useAppSelector(
    (state) => state.roaster,
  );

  const schoolId =
    currentUser?.school_id || currentSchool?.school_id || currentSchool?.id;

  useEffect(() => {
    if (schoolId) {
      dispatch(
        fetchTeachers({
          schoolId,
          page,
          limit,
          search,
          subject,
          department,
          status,
        }),
      );
    }
  }, [schoolId, page, limit, search, subject, department, status, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space size={8}>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {text}
          </span>
          {record.is_admin && (
            <Tag
              color="blue"
              style={{
                borderRadius: "4px",
                border: "none",
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Admin
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <span style={{ color: "var(--text-secondary)" }}>{email}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <span style={{ color: "var(--text-secondary)" }}>{phone || "—"}</span>
      ),
    },
    {
      title: "Subject & Dept",
      key: "subject_dept",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#45a29e", fontWeight: 500 }}>
            {record.subject || "N/A"}
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
            Dept: {record.department || "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Exp & Qualification",
      key: "exp_qual",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#ffa552" }}>
            {record.experience ? `${record.experience} Yrs` : "N/A"}
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
            {record.qualification || "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <StatusTag status={status || "active"} />,
    },
  ];

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
          School Teachers
        </Title>
        <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Browse and manage all registered teacher profiles in this school
          district.
        </Paragraph>
      </div>

      <Card
        title={
          <Space>
            <UserOutlined style={{ color: "#45a29e" }} />
            <span style={{ color: "var(--text-primary)" }}>
              Teachers Directory
            </span>
          </Space>
        }
        style={{
          background: "var(--bg-container)",
          border: "1px solid var(--border-muted)",
        }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={6}>
            <Input.Search
              placeholder="Search by name..."
              allowClear
              size="large"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by Subject"
              allowClear
              size="large"
              onChange={(value) => {
                setSubject(value || "");
                setPage(1);
              }}
              style={{ width: "100%" }}
              options={[
                { label: "Mathematics", value: "Mathematics" },
                { label: "Science", value: "Science" },
                { label: "English", value: "English" },
                { label: "History", value: "History" },
                { label: "Geography", value: "Geography" },
                { label: "Art", value: "Art" },
                { label: "Music", value: "Music" },
                { label: "Physical Education", value: "Physical Education" },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by Department"
              allowClear
              size="large"
              onChange={(value) => {
                setDepartment(value || "");
                setPage(1);
              }}
              style={{ width: "100%" }}
              options={[
                { label: "Science", value: "Science" },
                { label: "Mathematics", value: "Mathematics" },
                { label: "Humanities", value: "Humanities" },
                { label: "Languages", value: "Languages" },
                { label: "Arts", value: "Arts" },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by Status"
              allowClear
              size="large"
              onChange={(value) => {
                setStatus(value || "");
                setPage(1);
              }}
              style={{ width: "100%" }}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Pending", value: "pending" },
              ]}
            />
          </Col>
        </Row>

        <Table
          dataSource={teachers.map((t) => ({ ...t, key: t.id || t.email }))}
          columns={columns}
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
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

      <TeacherDetailDrawer
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
      />
    </div>
  );
};
export default TeachersList;
