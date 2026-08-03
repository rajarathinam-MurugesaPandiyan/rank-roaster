import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
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
  Statistic,
  Segmented,
  Empty,
  DatePicker,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { loadLocalStorage, saveLocalStorage } from "../../helpers/storage";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export interface SchoolEventItem {
  id: string;
  title: string;
  category:
    | "Academic"
    | "Sports"
    | "Cultural"
    | "Holiday"
    | "Parent-Teacher"
    | "Workshop"
    | "Exam";
  targetAudience: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  contactEmail?: string;
  description: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  createdAt: string;
}

const INITIAL_EVENTS: SchoolEventItem[] = [
  {
    id: "evt-101",
    title: "Annual Sports & Athletics Championship 2026",
    category: "Sports",
    targetAudience: "All Grades (K-12)",
    startDate: "2026-08-15 08:30",
    endDate: "2026-08-15 17:00",
    location: "Main Stadium & Sports Complex",
    organizer: "Physical Education Dept",
    contactEmail: "sports@campusdeck.edu",
    description:
      "Annual intra-school athletics meet including track and field, football finals, and award ceremony.",
    status: "Upcoming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-102",
    title: "Q1 Parent-Teacher Interactive Conference",
    category: "Parent-Teacher",
    targetAudience: "Parents & Students",
    startDate: "2026-08-22 09:00",
    endDate: "2026-08-22 14:00",
    location: "School Main Auditorium",
    organizer: "Academic Steering Committee",
    contactEmail: "ptm@campusdeck.edu",
    description:
      "One-on-one progress discussion for Quarter 1 academic performance, attendance, and feedback.",
    status: "Upcoming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-103",
    title: "AI & Science Innovation Exhibition",
    category: "Academic",
    targetAudience: "Grades 8-12",
    startDate: "2026-09-05 10:00",
    endDate: "2026-09-05 16:30",
    location: "Robotics & Science Labs",
    organizer: "Science & STEM Faculty",
    contactEmail: "stem@campusdeck.edu",
    description:
      "Student projects demonstration featuring AI models, robotics prototypes, and environmental science experiments.",
    status: "Upcoming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-104",
    title: "Inter-School Music & Cultural Fest",
    category: "Cultural",
    targetAudience: "High School (Grades 9-12)",
    startDate: "2026-09-18 11:00",
    endDate: "2026-09-18 18:00",
    location: "Open Air Amphitheater",
    organizer: "Cultural Club",
    contactEmail: "cultural@campusdeck.edu",
    description:
      "Music, dance, drama, and fine arts competition featuring participating schools across the district.",
    status: "Upcoming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-105",
    title: "Mid-Term Examination Readiness Workshop",
    category: "Workshop",
    targetAudience: "Grades 10 & 12",
    startDate: "2026-07-25 09:30",
    endDate: "2026-07-25 12:30",
    location: "Conference Room A",
    organizer: "Student Counseling Cell",
    contactEmail: "guidance@campusdeck.edu",
    description:
      "Stress management, time allocation strategies, and revision tactics for upcoming board and mid-term exams.",
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
];

const categoryColors: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Academic: {
    bg: "rgba(69, 162, 158, 0.15)",
    color: "#45a29e",
    border: "rgba(69, 162, 158, 0.3)",
  },
  Sports: {
    bg: "rgba(255, 165, 82, 0.15)",
    color: "#ffa552",
    border: "rgba(255, 165, 82, 0.3)",
  },
  Cultural: {
    bg: "rgba(155, 89, 182, 0.15)",
    color: "#9b59b6",
    border: "rgba(155, 89, 182, 0.3)",
  },
  Holiday: {
    bg: "rgba(46, 204, 113, 0.15)",
    color: "#2ecc71",
    border: "rgba(46, 204, 113, 0.3)",
  },
  "Parent-Teacher": {
    bg: "rgba(52, 152, 219, 0.15)",
    color: "#3498db",
    border: "rgba(52, 152, 219, 0.3)",
  },
  Workshop: {
    bg: "rgba(230, 126, 34, 0.15)",
    color: "#e67e22",
    border: "rgba(230, 126, 34, 0.3)",
  },
  Exam: {
    bg: "rgba(231, 76, 60, 0.15)",
    color: "#e74c3c",
    border: "rgba(231, 76, 60, 0.3)",
  },
};

export const SchoolEvents: React.FC = () => {
  const { schoolId: paramSchoolId } = useParams<{ schoolId: string }>();
  const { currentUser, currentSchool } = useAppSelector(
    (state) => state.roaster,
  );
  const activeSchool =
    paramSchoolId ||
    currentUser?.school_id ||
    currentSchool?.school_id ||
    currentSchool?.id ||
    "default-school";

  const storageKey = `campusdeck_${activeSchool}_events`;

  const [events, setEvents] = useState<SchoolEventItem[]>(() => {
    const saved = loadLocalStorage<SchoolEventItem[]>(
      storageKey,
      INITIAL_EVENTS,
    );
    return saved && Array.isArray(saved) && saved.length > 0
      ? saved
      : INITIAL_EVENTS;
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal & Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEventItem | null>(
    null,
  );
  const [detailDrawerEvent, setDetailDrawerEvent] =
    useState<SchoolEventItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    saveLocalStorage(storageKey, events);
  }, [events, storageKey]);

  // Filtered Events
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.location.toLowerCase().includes(search.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(search.toLowerCase()) ||
      evt.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || evt.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "ALL" || evt.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Event Statistics
  const totalCount = events.length;
  const upcomingCount = events.filter((e) => e.status === "Upcoming").length;
  const ongoingCount = events.filter((e) => e.status === "Ongoing").length;
  const completedCount = events.filter((e) => e.status === "Completed").length;

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    form.resetFields();
    form.setFieldsValue({
      category: "Academic",
      status: "Upcoming",
      targetAudience: "All Grades",
      startDate: dayjs().add(1, "day").hour(9).minute(0),
      endDate: dayjs().add(1, "day").hour(12).minute(0),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: SchoolEventItem) => {
    setEditingEvent(evt);
    form.setFieldsValue({
      title: evt.title,
      category: evt.category,
      targetAudience: evt.targetAudience,
      dateRange: [
        dayjs(evt.startDate, "YYYY-MM-DD HH:mm"),
        dayjs(evt.endDate, "YYYY-MM-DD HH:mm"),
      ],
      location: evt.location,
      organizer: evt.organizer,
      contactEmail: evt.contactEmail,
      status: evt.status,
      description: evt.description,
    });
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    message.success("Event deleted successfully!");
  };

  const handleFormFinish = (values: any) => {
    let startStr = dayjs().format("YYYY-MM-DD HH:mm");
    let endStr = dayjs().add(2, "hour").format("YYYY-MM-DD HH:mm");

    if (
      values.dateRange &&
      Array.isArray(values.dateRange) &&
      values.dateRange.length === 2
    ) {
      startStr = values.dateRange[0].format("YYYY-MM-DD HH:mm");
      endStr = values.dateRange[1].format("YYYY-MM-DD HH:mm");
    }

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                title: values.title,
                category: values.category,
                targetAudience: values.targetAudience,
                startDate: startStr,
                endDate: endStr,
                location: values.location,
                organizer: values.organizer,
                contactEmail: values.contactEmail || "",
                status: values.status,
                description: values.description || "",
              }
            : e,
        ),
      );
      message.success("Event updated successfully!");
    } else {
      const newEvt: SchoolEventItem = {
        id: `evt-${Date.now()}`,
        title: values.title,
        category: values.category,
        targetAudience: values.targetAudience,
        startDate: startStr,
        endDate: endStr,
        location: values.location,
        organizer: values.organizer,
        contactEmail: values.contactEmail || "",
        status: values.status,
        description: values.description || "",
        createdAt: new Date().toISOString(),
      };
      setEvents((prev) => [newEvt, ...prev]);
      message.success("New event created successfully!");
    }

    setIsModalOpen(false);
    form.resetFields();
  };

  const renderStatusTag = (status: string) => {
    if (status === "Ongoing") {
      return (
        <Tag
          color="processing"
          icon={<SyncOutlined spin />}
          style={{ borderRadius: 6, fontWeight: 600 }}
        >
          Ongoing
        </Tag>
      );
    }
    if (status === "Completed") {
      return (
        <Tag
          color="default"
          icon={<CheckCircleOutlined />}
          style={{ borderRadius: 6, fontWeight: 500 }}
        >
          Completed
        </Tag>
      );
    }
    return (
      <Tag
        color="cyan"
        icon={<ClockCircleOutlined />}
        style={{ borderRadius: 6, fontWeight: 600 }}
      >
        Upcoming
      </Tag>
    );
  };

  const columns = [
    {
      title: "Event Title & Category",
      key: "title",
      render: (_: any, record: SchoolEventItem) => {
        const catStyle =
          categoryColors[record.category] || categoryColors.Academic;
        return (
          <Space direction="vertical" size={2}>
            <Text
              strong
              style={{
                color: "var(--text-primary)",
                fontSize: 14,
                cursor: "pointer",
              }}
              onClick={() => setDetailDrawerEvent(record)}
            >
              {record.title}
            </Text>
            <Space size={6}>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  backgroundColor: catStyle.bg,
                  color: catStyle.color,
                  border: `1px solid ${catStyle.border}`,
                }}
              >
                {record.category}
              </span>
              <Text style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Audience: {record.targetAudience}
              </Text>
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_: any, record: SchoolEventItem) => (
        <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
          <div>
            <ClockCircleOutlined style={{ marginRight: 6, color: "#45a29e" }} />
            {dayjs(record.startDate).format("MMM DD, YYYY • hh:mm A")}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-secondary)",
              marginTop: 2,
            }}
          >
            To: {dayjs(record.endDate).format("MMM DD, YYYY • hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Location / Venue",
      dataIndex: "location",
      key: "location",
      render: (loc: string) => (
        <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
          <EnvironmentOutlined style={{ marginRight: 6, color: "#ffa552" }} />
          {loc}
        </span>
      ),
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
      render: (org: string) => (
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          <UserOutlined style={{ marginRight: 6 }} />
          {org}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => renderStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: SchoolEventItem) => (
        <Space size="small">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => setDetailDrawerEvent(record)}
            style={{ color: "#45a29e" }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
            style={{ color: "var(--text-secondary)" }}
          />
          <Popconfirm
            title="Delete Event"
            description="Are you sure you want to delete this event?"
            onConfirm={() => handleDeleteEvent(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* Header Banner & Right Create Action */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
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
            School Events & Calendar
          </Title>
          <Paragraph
            style={{
              color: "var(--text-secondary)",
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            Schedule academic meets, sports tournaments, cultural fests, and
            parent interaction sessions.
          </Paragraph>
        </div>

        {/* Right Action Button */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenCreateModal}
          style={{
            background: "var(--primary-brand)",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
          }}
        >
          Create New Event
        </Button>
      </div>

      {/* Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              background: "var(--bg-container)",
              border: "1px solid var(--border-muted)",
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  <CalendarOutlined
                    style={{ marginRight: 6, color: "#45a29e" }}
                  />{" "}
                  Total Events
                </span>
              }
              value={totalCount}
              valueStyle={{ color: "var(--text-primary)", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              background: "var(--bg-container)",
              border: "1px solid var(--border-muted)",
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  <ClockCircleOutlined
                    style={{ marginRight: 6, color: "#45a29e" }}
                  />{" "}
                  Upcoming
                </span>
              }
              value={upcomingCount}
              valueStyle={{ color: "#45a29e", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              background: "var(--bg-container)",
              border: "1px solid var(--border-muted)",
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  <SyncOutlined
                    spin
                    style={{ marginRight: 6, color: "#ffa552" }}
                  />{" "}
                  Ongoing
                </span>
              }
              value={ongoingCount}
              valueStyle={{ color: "#ffa552", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              background: "var(--bg-container)",
              border: "1px solid var(--border-muted)",
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  <CheckCircleOutlined
                    style={{ marginRight: 6, color: "#2da44e" }}
                  />{" "}
                  Completed
                </span>
              }
              value={completedCount}
              valueStyle={{ color: "#2da44e", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search & Filter Control Bar */}
      <Card
        style={{
          background: "var(--bg-container)",
          border: "1px solid var(--border-muted)",
          borderRadius: 12,
          marginBottom: 24,
        }}
        bodyStyle={{ padding: "16px 20px" }}
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={10}>
            <Input
              placeholder="Search event title, venue, or organizer..."
              prefix={
                <SearchOutlined style={{ color: "var(--text-secondary)" }} />
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-muted)",
                borderRadius: 8,
              }}
            />
          </Col>
          <Col xs={24} md={14}>
            <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: 170 }}
                dropdownStyle={{ background: "var(--bg-elevated)" }}
              >
                <Option value="ALL">All Categories</Option>
                <Option value="Academic">Academic</Option>
                <Option value="Sports">Sports</Option>
                <Option value="Cultural">Cultural</Option>
                <Option value="Holiday">Holiday</Option>
                <Option value="Parent-Teacher">Parent-Teacher</Option>
                <Option value="Workshop">Workshop</Option>
                <Option value="Exam">Exam</Option>
              </Select>

              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 140 }}
                dropdownStyle={{ background: "var(--bg-elevated)" }}
              >
                <Option value="ALL">All Status</Option>
                <Option value="Upcoming">Upcoming</Option>
                <Option value="Ongoing">Ongoing</Option>
                <Option value="Completed">Completed</Option>
              </Select>

              <Segmented
                options={[
                  { label: "", value: "grid", icon: <AppstoreOutlined /> },
                  {
                    label: "",
                    value: "table",
                    icon: <UnorderedListOutlined />,
                  },
                ]}
                value={viewMode}
                onChange={(v) => setViewMode(v as "grid" | "table")}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Events Presentation View */}
      {filteredEvents.length === 0 ? (
        <Card
          style={{
            background: "var(--bg-container)",
            border: "1px solid var(--border-muted)",
            borderRadius: 12,
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          <Empty
            description={
              <span style={{ color: "var(--text-secondary)" }}>
                No events match your criteria
              </span>
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreateModal}
            >
              Create Event Now
            </Button>
          </Empty>
        </Card>
      ) : viewMode === "table" ? (
        <Card
          style={{
            background: "var(--bg-container)",
            border: "1px solid var(--border-muted)",
            borderRadius: 12,
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            dataSource={filteredEvents.map((item) => ({
              ...item,
              key: item.id,
            }))}
            columns={columns}
            pagination={{ pageSize: 8 }}
            scroll={{ x: true }}
          />
        </Card>
      ) : (
        /* Grid Card View */
        <Row gutter={[20, 20]}>
          {filteredEvents.map((evt) => {
            const catStyle =
              categoryColors[evt.category] || categoryColors.Academic;
            return (
              <Col xs={24} sm={12} lg={8} key={evt.id}>
                <Card
                  hoverable
                  style={{
                    background: "var(--bg-container)",
                    border: "1px solid var(--border-muted)",
                    borderRadius: 14,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  bodyStyle={{
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Top Row: Category Tag & Status */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: catStyle.bg,
                          color: catStyle.color,
                          border: `1px solid ${catStyle.border}`,
                        }}
                      >
                        {evt.category}
                      </span>
                      {renderStatusTag(evt.status)}
                    </div>

                    {/* Title */}
                    <Title
                      level={4}
                      style={{
                        fontSize: 16,
                        margin: "0 0 10px 0",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        cursor: "pointer",
                      }}
                      onClick={() => setDetailDrawerEvent(evt)}
                    >
                      {evt.title}
                    </Title>

                    {/* Description preview */}
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: 13,
                        marginBottom: 16,
                      }}
                    >
                      {evt.description}
                    </Paragraph>

                    {/* Details Meta */}
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%", marginBottom: 16 }}
                    >
                      <div
                        style={{ fontSize: 13, color: "var(--text-primary)" }}
                      >
                        <ClockCircleOutlined
                          style={{ marginRight: 8, color: "#45a29e" }}
                        />
                        <strong>
                          {dayjs(evt.startDate).format("MMM DD, YYYY")}
                        </strong>
                        <span
                          style={{
                            color: "var(--text-secondary)",
                            marginLeft: 6,
                          }}
                        >
                          ({dayjs(evt.startDate).format("hh:mm A")} -{" "}
                          {dayjs(evt.endDate).format("hh:mm A")})
                        </span>
                      </div>

                      <div
                        style={{ fontSize: 13, color: "var(--text-secondary)" }}
                      >
                        <EnvironmentOutlined
                          style={{ marginRight: 8, color: "#ffa552" }}
                        />
                        {evt.location}
                      </div>

                      <div
                        style={{ fontSize: 12, color: "var(--text-secondary)" }}
                      >
                        <TeamOutlined style={{ marginRight: 8 }} />
                        {evt.targetAudience}
                      </div>
                    </Space>
                  </div>

                  {/* Card Bottom Footer Actions */}
                  <div
                    style={{
                      borderTop: "1px solid var(--border-muted)",
                      paddingTop: 12,
                      marginTop: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      By: {evt.organizer}
                    </Text>

                    <Space size={4}>
                      <Tooltip title="View Event Info">
                        <Button
                          type="text"
                          icon={<InfoCircleOutlined />}
                          onClick={() => setDetailDrawerEvent(evt)}
                          style={{ color: "#45a29e" }}
                        />
                      </Tooltip>
                      <Tooltip title="Edit Event">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleOpenEditModal(evt)}
                          style={{ color: "var(--text-secondary)" }}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="Delete Event"
                        description="Remove this event permanently?"
                        onConfirm={() => handleDeleteEvent(evt.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <Tooltip title="Delete Event">
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Tooltip>
                      </Popconfirm>
                    </Space>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Modal for Creating or Editing Events */}
      <Modal
        title={
          <Space>
            <CalendarOutlined style={{ color: "#45a29e" }} />
            <span>
              {editingEvent ? "Edit Event Details" : "Create New School Event"}
            </span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={680}
        style={{ top: 40 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormFinish}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="title"
            label={
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                Event Title
              </span>
            }
            rules={[{ required: true, message: "Please enter event title!" }]}
          >
            <Input placeholder="e.g. Annual Science Fair 2026" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label={
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Category
                  </span>
                }
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Option value="Academic">Academic</Option>
                  <Option value="Sports">Sports</Option>
                  <Option value="Cultural">Cultural</Option>
                  <Option value="Holiday">Holiday</Option>
                  <Option value="Parent-Teacher">Parent-Teacher</Option>
                  <Option value="Workshop">Workshop</Option>
                  <Option value="Exam">Exam</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label={
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Event Status
                  </span>
                }
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Option value="Upcoming">Upcoming</Option>
                  <Option value="Ongoing">Ongoing</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="targetAudience"
                label={
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Target Audience
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify target audience" },
                ]}
              >
                <Input
                  placeholder="e.g. All Grades, High School, Parents"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="location"
                label={
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Location / Venue
                  </span>
                }
                rules={[{ required: true, message: "Please specify location" }]}
              >
                <Input
                  placeholder="e.g. Main Auditorium, Sports Ground"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dateRange"
            label={
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                Start & End Date / Time
              </span>
            }
            rules={[
              { required: true, message: "Please select start and end time" },
            ]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="organizer"
                label={
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Organizer / Lead Dept
                  </span>
                }
                rules={[
                  { required: true, message: "Please specify organizer" },
                ]}
              >
                <Input
                  placeholder="e.g. Cultural Club, Science Faculty"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="contactEmail"
                label={
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Contact Email
                  </span>
                }
                rules={[
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="organizer@school.edu" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                Description & Details
              </span>
            }
            rules={[
              { required: true, message: "Please provide event description" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Outline event objectives, rules, schedule, and guest highlights..."
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 24,
            }}
          >
            <Button onClick={() => setIsModalOpen(false)} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                background: "var(--primary-brand)",
                border: "none",
                fontWeight: 600,
              }}
            >
              {editingEvent ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Event Details Drawer */}
      <Drawer
        title={
          <Space>
            <CalendarOutlined style={{ color: "#45a29e" }} />
            <span>Event Specification</span>
          </Space>
        }
        placement="right"
        width={500}
        open={!!detailDrawerEvent}
        onClose={() => setDetailDrawerEvent(null)}
      >
        {detailDrawerEvent && (
          <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    backgroundColor: (
                      categoryColors[detailDrawerEvent.category] ||
                      categoryColors.Academic
                    ).bg,
                    color: (
                      categoryColors[detailDrawerEvent.category] ||
                      categoryColors.Academic
                    ).color,
                    border: `1px solid ${(categoryColors[detailDrawerEvent.category] || categoryColors.Academic).border}`,
                  }}
                >
                  {detailDrawerEvent.category}
                </span>
                {renderStatusTag(detailDrawerEvent.status)}
              </div>
              <Title
                level={3}
                style={{ margin: "8px 0", color: "var(--text-primary)" }}
              >
                {detailDrawerEvent.title}
              </Title>
            </div>

            <Card
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-muted)",
                borderRadius: 10,
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ClockCircleOutlined
                    style={{ marginRight: 10, color: "#45a29e", fontSize: 16 }}
                  />
                  <div>
                    <Text strong style={{ color: "var(--text-primary)" }}>
                      {dayjs(detailDrawerEvent.startDate).format(
                        "dddd, MMMM DD, YYYY",
                      )}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(detailDrawerEvent.startDate).format("hh:mm A")} to{" "}
                      {dayjs(detailDrawerEvent.endDate).format("hh:mm A")}
                    </Text>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <EnvironmentOutlined
                    style={{ marginRight: 10, color: "#ffa552", fontSize: 16 }}
                  />
                  <div>
                    <Text strong style={{ color: "var(--text-primary)" }}>
                      {detailDrawerEvent.location}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Venue & Location
                    </Text>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <TeamOutlined
                    style={{ marginRight: 10, color: "#9b59b6", fontSize: 16 }}
                  />
                  <div>
                    <Text strong style={{ color: "var(--text-primary)" }}>
                      {detailDrawerEvent.targetAudience}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Target Audience / Participants
                    </Text>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <UserOutlined
                    style={{ marginRight: 10, color: "#3498db", fontSize: 16 }}
                  />
                  <div>
                    <Text strong style={{ color: "var(--text-primary)" }}>
                      {detailDrawerEvent.organizer}
                    </Text>
                    {detailDrawerEvent.contactEmail && (
                      <>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {detailDrawerEvent.contactEmail}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </Space>
            </Card>

            <div>
              <Title
                level={5}
                style={{ color: "var(--text-primary)", marginBottom: 8 }}
              >
                About Event
              </Title>
              <Paragraph
                style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
              >
                {detailDrawerEvent.description}
              </Paragraph>
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  const evt = detailDrawerEvent;
                  setDetailDrawerEvent(null);
                  handleOpenEditModal(evt);
                }}
                style={{ flex: 1, background: "#45a29e", border: "none" }}
              >
                Edit Details
              </Button>
              <Button onClick={() => setDetailDrawerEvent(null)}>Close</Button>
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  );
};
