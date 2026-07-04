import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Typography,
  Space,
  Input,
  Select,
  Progress,
  Tag,
} from "antd";
import {
  SearchOutlined,
  TrophyOutlined,
  BarChartOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { GRADES } from "../../redux/schoolSlice";

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface GradeItem {
  id: string;
  studentName: string;
  gradeLevel: string;
  subject: string;
  score: number;
  letter: string;
  status: "Excellent" | "Good" | "Needs Improvement" | "Critical";
}

// Initial mock grades data representing typical school database records
const INITIAL_GRADES: GradeItem[] = [
  {
    id: "1",
    studentName: "Sophia Martinez",
    gradeLevel: "Grade 10",
    subject: "Algebra II",
    score: 94,
    letter: "A",
    status: "Excellent",
  },
  {
    id: "2",
    studentName: "Marcus Vance",
    gradeLevel: "Grade 11",
    subject: "AP Chemistry",
    score: 88,
    letter: "B+",
    status: "Good",
  },
  {
    id: "3",
    studentName: "Ethan Hunt",
    gradeLevel: "Grade 9",
    subject: "World History",
    score: 76,
    letter: "C+",
    status: "Needs Improvement",
  },
  {
    id: "4",
    studentName: "Emily Watson",
    gradeLevel: "Grade 10",
    subject: "Algebra II",
    score: 98,
    letter: "A+",
    status: "Excellent",
  },
  {
    id: "5",
    studentName: "Lucas Hood",
    gradeLevel: "Grade 12",
    subject: "Advanced Literature",
    score: 91,
    letter: "A-",
    status: "Excellent",
  },
  {
    id: "6",
    studentName: "Carrie Mathison",
    gradeLevel: "Grade 11",
    subject: "AP Chemistry",
    score: 55,
    letter: "D",
    status: "Critical",
  },
  {
    id: "7",
    studentName: "Danny Rand",
    gradeLevel: "Grade 9",
    subject: "World History",
    score: 84,
    letter: "B",
    status: "Good",
  },
  {
    id: "8",
    studentName: "Jessica Jones",
    gradeLevel: "Grade 12",
    subject: "Advanced Literature",
    score: 89,
    letter: "B+",
    status: "Good",
  },
];

export const SchoolGrades: React.FC = () => {
  const [grades] = useState<GradeItem[]>(INITIAL_GRADES);
  const [searchText, setSearchText] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const filteredGrades = grades.filter((g) => {
    const matchesSearch = g.studentName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesGrade = selectedGrade ? g.gradeLevel === selectedGrade : true;
    const matchesSubject = selectedSubject
      ? g.subject === selectedSubject
      : true;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  const averageScore = Math.round(
    filteredGrades.reduce((sum, curr) => sum + curr.score, 0) /
      (filteredGrades.length || 1),
  );

  const passingCount = filteredGrades.filter((g) => g.score >= 60).length;
  const passingRate = Math.round(
    (passingCount / (filteredGrades.length || 1)) * 100,
  );

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "#45a29e"; // Teal
      case "Good":
        return "#2ea043"; // Green
      case "Needs Improvement":
        return "#ffa552"; // Amber
      case "Critical":
        return "#f85149"; // Red
      default:
        return "#8b949e";
    }
  };

  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
      render: (text: string) => (
        <span style={{ fontWeight: 600, color: "#f0f6fc" }}>{text}</span>
      ),
    },
    {
      title: "Grade Level",
      dataIndex: "gradeLevel",
      key: "gradeLevel",
      render: (text: string) => (
        <span style={{ color: "#8b949e" }}>{text}</span>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text: string) => (
        <span style={{ color: "#8b949e" }}>{text}</span>
      ),
    },
    {
      title: "Academic Score",
      dataIndex: "score",
      key: "score",
      render: (score: number) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 150,
          }}
        >
          <Progress
            percent={score}
            size="small"
            strokeColor={
              score >= 85 ? "#45a29e" : score >= 60 ? "#ffa552" : "#f85149"
            }
            trailColor="var(--bg-elevated)"
            showInfo={false}
          />
          <span style={{ fontWeight: 600, color: "#f0f6fc" }}>{score}%</span>
        </div>
      ),
    },
    {
      title: "Grade",
      dataIndex: "letter",
      key: "letter",
      render: (letter: string) => (
        <span
          style={{
            fontWeight: 700,
            color: letter.startsWith("A") ? "#45a29e" : "#ffa552",
            fontSize: 15,
          }}
        >
          {letter}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={getStatusTagColor(status)}
          style={{ border: "none", color: "#fff", fontWeight: 500 }}
        >
          {status}
        </Tag>
      ),
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
          Academic Grades
        </Title>
        <Paragraph style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Browse student performance records, review GPA summaries, and analyze
          grade classifications by subject.
        </Paragraph>
      </div>

      {/* Analytics KPI Metrics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: "var(--bg-container)", border: "1px solid var(--border-muted)" }}>
            <Space direction="vertical" size={4}>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Class Avg Score
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <Title
                  level={3}
                  style={{ margin: 0, color: "#45a29e", fontWeight: 700 }}
                >
                  {averageScore}%
                </Title>
                <BarChartOutlined style={{ color: "#45a29e", fontSize: 18 }} />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: "var(--bg-container)", border: "1px solid var(--border-muted)" }}>
            <Space direction="vertical" size={4}>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Passing Rate
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <Title
                  level={3}
                  style={{ margin: 0, color: "#2ea043", fontWeight: 700 }}
                >
                  {passingRate}%
                </Title>
                <CheckCircleOutlined
                  style={{ color: "#2ea043", fontSize: 18 }}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: "var(--bg-container)", border: "1px solid var(--border-muted)" }}>
            <Space direction="vertical" size={4}>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Outstanding Performance
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <Title
                  level={3}
                  style={{ margin: 0, color: "#ffa552", fontWeight: 700 }}
                >
                  {
                    filteredGrades.filter((g) => g.status === "Excellent")
                      .length
                  }{" "}
                  Students
                </Title>
                <TrophyOutlined style={{ color: "#ffa552", fontSize: 18 }} />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: "var(--bg-container)", border: "1px solid var(--border-muted)" }}>
            <Space direction="vertical" size={4}>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Total Evaluated
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <Title
                  level={3}
                  style={{ margin: 0, color: "var(--text-primary)", fontWeight: 700 }}
                >
                  {filteredGrades.length} Records
                </Title>
                <LineChartOutlined style={{ color: "var(--text-secondary)", fontSize: 18 }} />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Filter Row and Main Grades Grid */}
      <Card
        title={
          <Space>
            <TrophyOutlined style={{ color: "#45a29e" }} />
            <span style={{ color: "var(--text-primary)" }}>Academic Performance Table</span>
          </Space>
        }
        style={{ background: "var(--bg-container)", border: "1px solid var(--border-muted)" }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by student name..."
              allowClear
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }} />}
              style={{
                background: "var(--bg-container)",
                border: "1px solid var(--border-muted)",
                color: "var(--text-primary)",
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by Grade level"
              allowClear
              size="large"
              style={{ width: "100%" }}
              dropdownStyle={{ background: "var(--bg-elevated)" }}
              onChange={(value) => setSelectedGrade(value)}
            >
              {GRADES.map((grade) => (
                <Option key={grade} value={grade}>
                  {grade}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by Subject"
              allowClear
              size="large"
              style={{ width: "100%" }}
              dropdownStyle={{ background: "var(--bg-elevated)" }}
              onChange={(value) => setSelectedSubject(value)}
            >
              <Option value="Algebra II">Algebra II</Option>
              <Option value="AP Chemistry">AP Chemistry</Option>
              <Option value="World History">World History</Option>
              <Option value="Advanced Literature">Advanced Literature</Option>
            </Select>
          </Col>
        </Row>

        <Table
          dataSource={filteredGrades.map((g) => ({ ...g, key: g.id }))}
          columns={columns}
          scroll={{ x: true }}
          style={{ background: "transparent" }}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default SchoolGrades;
