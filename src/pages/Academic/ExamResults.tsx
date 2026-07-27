import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Card,
  Table,
  InputNumber,
  Button,
  message,
  Space,
  Row,
  Col,
  Spin,
  Alert,
  Tooltip,
  Drawer,
  Form,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchExamsBySchool } from "../../redux/exam/examSlice";
import { fetchStudents } from "../../redux/students/studentsSlice";
import { fetchGradesBySchool } from "../../redux/roaster/roasterSlice";
import { fetchAcademicYearsBySchool } from "../../redux/academic/academicSlice";
import {
  fetchExamResults,
  createExamResult,
  updateExamResult,
} from "../../redux/exam-result/examResultSlice";

const { Title, Paragraph, Text } = Typography;

export const ExamResults: React.FC = () => {
  const { schoolId, academicYearId, examId } = useParams<{
    schoolId: string;
    academicYearId: string;
    examId: string;
  }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { exams, loading: examsLoading } = useAppSelector(
    (state) => state.exam,
  );
  const { students, loading: studentsLoading } = useAppSelector(
    (state) => state.students,
  );
  const { grades = [] } = useAppSelector((state) => state.roaster);
  const { academicYears = [] } = useAppSelector((state) => state.academic);
  const { results, loading: resultsLoading } = useAppSelector(
    (state) => state.examResults,
  );

  // Local state to manage keying in marks
  const [editedMarks, setEditedMarks] = useState<
    Record<string, Record<string, number>>
  >({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [drawerMarks, setDrawerMarks] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const exam = exams.find((e) => e.id === examId);
  const gradeObj = exam
    ? grades.find((g: any) => g.id === exam.grade_id)
    : null;
  const gradeName = gradeObj ? gradeObj.name : "—";
  const ayObj = academicYears.find((ay: any) => ay.id === academicYearId);
  const ayName = ayObj ? `${ayObj.name} (${ayObj.academicYear})` : "—";

  // 1. Initial mounts
  useEffect(() => {
    if (schoolId) {
      dispatch(fetchExamsBySchool({ schoolId }));
      dispatch(fetchGradesBySchool(schoolId));
      dispatch(fetchAcademicYearsBySchool(schoolId));
    }
  }, [schoolId, dispatch]);

  // 2. Once exam details are loaded, fetch students of this grade, and existing exam results
  useEffect(() => {
    if (schoolId && exam) {
      dispatch(
        fetchStudents({
          schoolId,
          gradeId: exam.grade_id,
          page: 1,
          limit: 200, // Fetch large limit to get all students of the class
        }),
      );
      dispatch(
        fetchExamResults({
          schoolId,
          examId: exam.id,
          gradeId: exam.grade_id,
          academicYearId: academicYearId || "",
        }),
      );
    }
  }, [schoolId, exam, academicYearId, dispatch]);

  // 3. Initialize editedMarks state from backend results
  useEffect(() => {
    if (results && results.length > 0) {
      const initial: Record<string, Record<string, number>> = {};
      results.forEach((res) => {
        initial[res.student_id] = {};
        res.subject_marks.forEach((sm) => {
          initial[res.student_id][sm.subject_id] = sm.marks_obtained;
        });
      });
      setEditedMarks(initial);
    }
  }, [results]);

  // Filter students array locally to only keep those enrolled in this grade & academic year
  const filteredStudents = students.filter((student) => {
    if (!exam) return false;
    const studentGradeId = student.gradeId || student.enrollment?.grade_id;
    const studentAY =
      student.academicYearId || student.enrollment?.academic_year_id;
    return studentGradeId === exam.grade_id && studentAY === academicYearId;
  });

  const handleRowClick = (student: any) => {
    setSelectedStudent(student);
    const initial: Record<string, number> = {};
    exam?.subjects.forEach((sub) => {
      initial[sub.subject_id] = editedMarks[student.id]?.[sub.subject_id] ?? 0;
    });
    setDrawerMarks(initial);
    setDrawerVisible(true);
  };

  const handleSaveDrawerMarks = async () => {
    if (!exam || !schoolId || !academicYearId || !selectedStudent) return;

    const studentId = selectedStudent.id;
    const student = filteredStudents.find((s) => s.id === studentId);
    if (!student) return;

    const enrollmentId = student.enrollment?.id;
    if (!enrollmentId) {
      message.error(
        `Cannot save marks: Student ${
          student.fullName || student.firstName
        } has no active enrollment record.`,
      );
      return;
    }

    setSaving(true);

    // Build subject marks array from drawerMarks state
    const subjectMarks = exam.subjects.map((sub) => {
      const marksObtained = drawerMarks[sub.subject_id] ?? 0;
      return {
        subject_id: sub.subject_id,
        subject_name: sub.name,
        marks_obtained: marksObtained,
        total_marks: sub.max_marks,
      };
    });

    const existingResult = results.find((r) => r.student_id === studentId);

    try {
      if (existingResult) {
        // Update existing results
        await dispatch(
          updateExamResult({
            id: existingResult.id,
            subject_marks: subjectMarks,
            remarks: "Updated via results drawer",
          }),
        ).unwrap();
      } else {
        // Create new results record
        await dispatch(
          createExamResult({
            school_id: schoolId,
            academic_year_id: academicYearId,
            student_id: studentId,
            student_enrollment_id: enrollmentId,
            grade_id: exam.grade_id,
            exam_id: exam.id,
            subject_marks: subjectMarks,
            remarks: "Created via results drawer",
          }),
        ).unwrap();
      }

      // Update our local cache of marks
      setEditedMarks((prev) => ({
        ...prev,
        [studentId]: drawerMarks,
      }));

      message.success(
        `Saved marks for ${student.fullName || student.firstName}`,
      );
      setDrawerVisible(false);
      setSelectedStudent(null);
    } catch (err: any) {
      message.error(err || "Failed to save marks");
    } finally {
      setSaving(false);
    }
  };

  // Build table columns dynamically based on the exam subjects
  const tableColumns = [
    {
      title: "Roll No",
      key: "rollNo",
      width: 90,
      render: (_: any, record: any) => {
        const rollNo = record.rollNo || record.enrollment?.roll_no;
        return (
          <span style={{ color: "var(--text-secondary)" }}>
            {rollNo || "—"}
          </span>
        );
      },
    },
    {
      title: "Student Name",
      key: "name",
      width: 220,
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
          {record.fullName || `${record.firstName} ${record.lastName}`}
        </span>
      ),
    },
    ...(exam?.subjects || []).map((sub) => ({
      title: (
        <Tooltip title={`Max Marks: ${sub.max_marks}`}>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "block",
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              {sub.name}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              Max: {sub.max_marks}
            </span>
          </div>
        </Tooltip>
      ),
      key: sub.subject_id,
      width: 140,
      render: (_: any, record: any) => {
        const mark = editedMarks[record.id]?.[sub.subject_id];
        return (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            {mark !== undefined
              ? `${mark} / ${sub.max_marks}`
              : `— / ${sub.max_marks}`}
          </div>
        );
      },
    })),
    {
      title: "Obtained Total",
      key: "totalObtained",
      width: 130,
      render: (_: any, record: any) => {
        const studentMarks = editedMarks[record.id] || {};
        let sum = 0;
        exam?.subjects.forEach((sub) => {
          sum += studentMarks[sub.subject_id] ?? 0;
        });
        const maxTotal =
          exam?.subjects.reduce((acc, s) => acc + s.max_marks, 0) || 0;
        return (
          <span style={{ fontWeight: 700, color: "#45a29e" }}>
            {sum.toFixed(1)} / {maxTotal}
          </span>
        );
      },
    },
    {
      title: "Percentage",
      key: "percentage",
      width: 110,
      render: (_: any, record: any) => {
        const studentMarks = editedMarks[record.id] || {};
        let sum = 0;
        exam?.subjects.forEach((sub) => {
          sum += studentMarks[sub.subject_id] ?? 0;
        });
        const maxTotal =
          exam?.subjects.reduce((acc, s) => acc + s.max_marks, 0) || 0;
        const pct = maxTotal > 0 ? (sum / maxTotal) * 100 : 0;
        return (
          <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
            {pct.toFixed(1)}%
          </span>
        );
      },
    },
  ];

  const isLoading = examsLoading || studentsLoading || resultsLoading;

  if (isLoading && !exam) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Spin size="large" tip="Loading exam results dashboard..." />
      </div>
    );
  }

  if (!exam) {
    return (
      <Alert
        message="Exam not found"
        description="We couldn't locate details for the requested exam ID. Please return to the exams dashboard."
        type="error"
        showIcon
        action={
          <Link to={`/${schoolId}/academic/${academicYearId}/exams`}>
            <Button size="small" type="primary">
              Back to Exams
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Space style={{ marginBottom: 12 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() =>
              navigate(`/${schoolId}/academic/${academicYearId}/exams`)
            }
            style={{ color: "#45a29e", padding: 0 }}
          >
            Back to Exams
          </Button>
        </Space>

        <Row justify="space-between" align="middle">
          <Col>
            <Title
              level={2}
              style={{
                margin: 0,
                color: "var(--text-primary)",
                fontWeight: 700,
              }}
            >
              Enter Exam Marks: {exam.name}
            </Title>
            <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
              Grade:{" "}
              <Text strong style={{ color: "#45a29e" }}>
                {gradeName}
              </Text>{" "}
              | Academic Year:{" "}
              <Text strong style={{ color: "#45a29e" }}>
                {ayName}
              </Text>
            </Paragraph>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={6}>
          <Card
            bodyStyle={{ padding: 16 }}
            style={{
              background: "var(--bg-container)",
              border: "1px solid var(--border-muted)",
              borderRadius: 12,
              height: "100%",
            }}
          >
            <Space>
              <InfoCircleOutlined style={{ color: "#45a29e", fontSize: 18 }} />
              <Text strong style={{ color: "var(--text-primary)" }}>
                Class Statistics
              </Text>
            </Space>
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text type="secondary">Grade Strength:</Text>
                <Text strong>{filteredStudents.length} Students</Text>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text type="secondary">Marks Entered:</Text>
                <Text strong>
                  {results.length} / {filteredStudents.length}
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Subjects Evaluated:</Text>
                <Text strong>{exam.subjects.length}</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={18}>
          <Card
            bodyStyle={{ padding: 16 }}
            style={{
              background: "var(--bg-container)",
              border: "1px solid var(--border-muted)",
              borderRadius: 12,
              height: "100%",
            }}
          >
            <Text
              strong
              style={{
                display: "block",
                marginBottom: 12,
                color: "var(--text-primary)",
              }}
            >
              Exam Subjects & Max Marks Details
            </Text>
            <Row gutter={[8, 8]}>
              {exam.subjects.map((sub) => (
                <Col xs={12} sm={8} md={6} key={sub.subject_id}>
                  <div
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-muted)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: 13,
                        color: "var(--text-primary)",
                      }}
                    >
                      {sub.name}
                    </span>
                    <span
                      style={{ fontSize: 11, color: "var(--text-secondary)" }}
                    >
                      Max: {sub.max_marks} | Teacher: {sub.teacher_name || "—"}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          background: "var(--bg-container)",
          border: "1px solid var(--border-muted)",
          borderRadius: 12,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          dataSource={filteredStudents.map((s) => ({ ...s, key: s.id }))}
          columns={tableColumns}
          loading={isLoading}
          pagination={false}
          scroll={{ x: 1000 }}
          style={{ background: "transparent" }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Drawer
        title={
          <div style={{ color: "var(--text-primary)" }}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>
              Enter Marks:{" "}
              {selectedStudent?.fullName ||
                `${selectedStudent?.firstName || ""} ${selectedStudent?.lastName || ""}`}
            </span>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                fontWeight: 400,
                marginTop: 4,
              }}
            >
              Roll No:{" "}
              {selectedStudent?.rollNo ||
                selectedStudent?.enrollment?.roll_no ||
                "—"}{" "}
              | Admission No: {selectedStudent?.admissionNo || "—"}
            </div>
          </div>
        }
        placement="right"
        width={420}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedStudent(null);
        }}
        open={drawerVisible}
        bodyStyle={{ background: "var(--bg-container)", padding: 24 }}
        headerStyle={{
          background: "var(--bg-container)",
          borderBottom: "1px solid var(--border-muted)",
        }}
        footer={
          <div
            style={{
              textAlign: "right",
              padding: "10px 16px",
              background: "var(--bg-container)",
              borderTop: "1px solid var(--border-muted)",
            }}
          >
            <Button
              style={{ marginRight: 8, borderRadius: 6 }}
              onClick={() => {
                setDrawerVisible(false);
                setSelectedStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={saving}
              onClick={handleSaveDrawerMarks}
              style={{
                borderRadius: 6,
                backgroundColor: "#45a29e",
                borderColor: "#45a29e",
              }}
            >
              Save Marks
            </Button>
          </div>
        }
      >
        {selectedStudent && exam && (
          <Form layout="vertical">
            {exam.subjects.map((sub) => (
              <Form.Item
                key={sub.subject_id}
                label={
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    {sub.name}{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        color: "var(--text-secondary)",
                        fontSize: 12,
                      }}
                    >
                      (Max: {sub.max_marks})
                    </span>
                  </span>
                }
              >
                <InputNumber
                  min={0}
                  max={sub.max_marks}
                  precision={2}
                  value={drawerMarks[sub.subject_id] ?? 0}
                  onChange={(val) => {
                    setDrawerMarks((prev) => ({
                      ...prev,
                      [sub.subject_id]: val ?? 0,
                    }));
                  }}
                  style={{
                    width: "100%",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-muted)",
                    color: "var(--text-primary)",
                    borderRadius: 6,
                  }}
                  placeholder={`Enter score (0 - ${sub.max_marks})`}
                />
              </Form.Item>
            ))}
          </Form>
        )}
      </Drawer>
    </div>
  );
};
export default ExamResults;
