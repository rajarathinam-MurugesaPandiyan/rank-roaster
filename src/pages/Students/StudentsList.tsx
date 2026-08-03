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
  Avatar,
} from "antd";
import { TeamOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { AsyncAvatar } from "../../components/AsyncAvatar";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchStudents, clearError } from "../../redux/students/studentsSlice";
import { fetchGradesBySchool } from "../../redux/roaster/roasterSlice";
import { fetchAcademicYearsBySchool } from "../../redux/academic/academicSlice";
import type { StudentItem } from "../../redux/students/studentsSlice";
import { StatusTag } from "../../atoms/StatusTag";
import { StudentDetailDrawer } from "./StudentDetailDrawer";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const StudentsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, total, loading, error } = useAppSelector(
    (state) => state.students,
  );
  const { grades = [] } = useAppSelector((state) => state.roaster);
  const { academicYears = [] } = useAppSelector((state) => state.academic);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [status, setStatus] = useState("");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(
    null,
  );

  const handleRowClick = (record: StudentItem) => {
    setSelectedStudent(record);
    setDrawerVisible(true);
  };

  const { currentUser, currentSchool } = useAppSelector(
    (state) => state.roaster,
  );

  const schoolId =
    currentUser?.school_id || currentSchool?.school_id || currentSchool?.id;

  // Load grades and academic years once on mount
  useEffect(() => {
    if (schoolId) {
      dispatch(fetchGradesBySchool(schoolId));
      dispatch(fetchAcademicYearsBySchool(schoolId));
    }
  }, [schoolId, dispatch]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Load students based on selected school, grade, page, limit, search, and status
  useEffect(() => {
    if (schoolId) {
      dispatch(
        fetchStudents({
          schoolId,
          gradeId: gradeId || undefined,
          page,
          limit,
          search: debouncedSearch || undefined,
          status: status || undefined,
        }),
      );
    }
  }, [schoolId, gradeId, page, limit, debouncedSearch, status, dispatch]);

  // Error handling
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const columns = [
    {
      title: "Name",
      key: "fullName",
      render: (_: any, record: StudentItem) => (
        <Space size={12}>
          <AsyncAvatar
            size={36}
            src={record.photoUrl || (record as any).photo_url}
            icon={<UserOutlined />}
            style={{ backgroundColor: "var(--primary-brand)" }}
          />
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {record.fullName || `${record.firstName} ${record.lastName}`}
          </span>
        </Space>
      ),
    },
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      key: "admissionNo",
      render: (text: string) => (
        <span style={{ color: "var(--text-secondary)" }}>{text || "—"}</span>
      ),
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      key: "rollNo",
      render: (text: string) => (
        <span style={{ color: "var(--text-secondary)" }}>{text || "—"}</span>
      ),
    },
    {
      title: "Grade & Section",
      key: "gradeSection",
      render: (_: any, record: StudentItem) => {
        const targetGradeId = record.gradeId || record.enrollment?.grade_id;
        const gradeObj = grades.find((g: any) => g.id === targetGradeId);
        const gradeName = gradeObj ? gradeObj.name : "Unassigned";
        const sectionVal = record.section || record.enrollment?.section;
        const sectionInfo = sectionVal ? ` - Section ${sectionVal}` : "";
        return (
          <span style={{ color: "#45a29e", fontWeight: 500 }}>
            {gradeName}
            {sectionInfo}
          </span>
        );
      },
    },
    {
      title: "Academic Year",
      key: "academicYearId",
      render: (_: any, record: StudentItem) => {
        const ayId =
          record.academicYearId || record.enrollment?.academic_year_id;
        const ayObj = academicYears.find((ay: any) => ay.id === ayId);
        return (
          <span style={{ color: "var(--text-secondary)" }}>
            {ayObj ? `${ayObj.name} (${ayObj.academicYear})` : "—"}
          </span>
        );
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text: string) => (
        <span
          style={{
            color: "var(--text-secondary)",
            textTransform: "capitalize",
          }}
        >
          {text || "—"}
        </span>
      ),
    },
    {
      title: "Parents Contact",
      key: "parents",
      render: (_: any, record: StudentItem) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "var(--text-primary)",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            F: {record.fatherName || "—"}
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
            M: {record.motherName || "—"}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <StatusTag status={status || "Active"} />,
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
          School Students
        </Title>
        <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Browse, filter, and view student directory profiles in this school.
        </Paragraph>
      </div>

      <Card
        title={
          <Space>
            <TeamOutlined style={{ color: "#45a29e" }} />
            <span style={{ color: "var(--text-primary)" }}>
              Students Directory
            </span>
          </Space>
        }
        style={{
          background: "var(--bg-container)",
          border: "1px solid var(--border-muted)",
          borderRadius: 12,
        }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by name or admission number..."
              allowClear
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={
                <SearchOutlined style={{ color: "var(--text-secondary)" }} />
              }
              style={{
                background: "var(--bg-container)",
                border: "1px solid var(--border-muted)",
                color: "var(--text-primary)",
                borderRadius: 8,
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select Grade"
              allowClear
              size="large"
              value={gradeId || undefined}
              onChange={(value) => {
                setGradeId(value || "");
                setPage(1);
              }}
              style={{ width: "100%" }}
              dropdownStyle={{ background: "var(--bg-elevated)" }}
            >
              {grades.map((grade: any) => (
                <Option key={grade.id} value={grade.id}>
                  {grade.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by Status"
              allowClear
              size="large"
              value={status || undefined}
              onChange={(value) => {
                setStatus(value || "");
                setPage(1);
              }}
              style={{ width: "100%" }}
              dropdownStyle={{ background: "var(--bg-elevated)" }}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Graduated", value: "Graduated" },
                { label: "Transferred", value: "Transferred" },
              ]}
            />
          </Col>
        </Row>

        <Table
          dataSource={students.map((s) => ({ ...s, key: s.id }))}
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

      <StudentDetailDrawer
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />
    </div>
  );
};

export default StudentsList;
