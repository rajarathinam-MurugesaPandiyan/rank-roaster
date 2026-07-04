import React from 'react';
import { Card, Row, Col, Progress, Table, Typography, Space, Statistic } from 'antd';
import { UserOutlined, BookOutlined, HourglassOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../redux/store';
import { StatCard } from '../../molecules/StatCard';
import { StatusTag } from '../../atoms/StatusTag';
import { RoleTag } from '../../atoms/RoleTag';
import type { DocumentItem } from '../../redux/schoolSlice';


const { Title, Paragraph } = Typography;

export const SchoolDashboard: React.FC = () => {
  const { students, classes } = useAppSelector((state) => state.school);

  const totalStudents = students.length;
  const totalClasses = classes.length;
  
  const pendingCount = students.filter(s => s.status === 'Pending').length;
  const verifiedCount = students.filter(s => s.status === 'Verified').length;
  const enrolledCount = students.filter(s => s.status === 'Enrolled').length;
  
  const onboardingCompletion = totalStudents > 0 
    ? Math.round(((verifiedCount + enrolledCount) / totalStudents) * 100)
    : 0;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text}</span>
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <RoleTag role={role} />
    },
    {
      title: 'Grade / Dept / Subject',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade: string, record: any) => {
        if (record.role === 'Teacher') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#45a29e', fontWeight: 500 }}>
                Subject: {record.subject || 'N/A'}
              </span>
              {(record.experience || record.qualification) && (
                <span style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: 2 }}>
                  {record.experience ? `${record.experience} yrs exp` : ''}
                  {record.experience && record.qualification ? ' • ' : ''}
                  {record.qualification || ''}
                </span>
              )}
            </div>
          );
        }
        if (record.role === 'Staff') {
          return (
            <span style={{ color: 'var(--text-secondary)' }}>
              Dept: {record.department || 'N/A'}
            </span>
          );
        }
        return <span style={{ color: 'var(--text-secondary)' }}>{grade}</span>;
      }
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span style={{ color: 'var(--text-secondary)' }}>{email}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />
    },
    {
      title: 'Date Onboarded',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => <span style={{ color: 'var(--text-secondary)' }}>{date}</span>
    },
    {
      title: 'Supporting Documents',
      dataIndex: 'documents',
      key: 'documents',
      render: (docs?: DocumentItem[]) => {
        if (!docs || docs.length === 0) return <span style={{ color: 'var(--text-secondary)' }}>—</span>;
        return (
          <Space size="small" wrap>
            {docs.map((doc, idx) => {
              const isImage = doc.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.url);
              return isImage ? (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#45a29e',
                    fontSize: '12px',
                    textDecoration: 'underline',
                    fontWeight: 500
                  }}
                >
                  {doc.name}
                </a>
              ) : (
                <span
                  key={idx}
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    cursor: 'not-allowed'
                  }}
                  title="Preview only available for images"
                >
                  {doc.name}
                </span>
              );
            })}
          </Space>
        );
      }

    }
  ];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700 }}>
          Overview & Metrics
        </Title>
        <Paragraph style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
          Live metrics tracking student enrollment states, verify lists, and academic units.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <StatCard
            title={<span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}><UserOutlined style={{ color: '#45a29e' }} /> Total Directory</span>}
            value={totalStudents}
            suffix={<span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>active</span>}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <StatCard
            title={<span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}><HourglassOutlined style={{ color: '#ffa552' }} /> Onboarding Queue</span>}
            value={pendingCount}
            valueStyle={{ color: '#ffa552' }}
            suffix={<span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>pending verify</span>}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <StatCard
            title={<span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}><BookOutlined style={{ color: '#45a29e' }} /> Active Classes</span>}
            value={totalClasses}
            suffix={<span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>curriculum</span>}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <Card
            title={<Space><CheckCircleOutlined style={{ color: '#45a29e' }} /><span style={{ color: 'var(--text-primary)' }}>Onboarding Progress</span></Space>}
            style={{ background: 'var(--bg-container)', border: '1px solid var(--border-muted)', height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
              <Progress
                type="circle"
                percent={onboardingCompletion}
                strokeColor={{
                  '0%': '#ffa552',
                  '100%': '#45a29e'
                }}
                width={140}
                strokeWidth={10}
                format={(percent) => (
                  <div style={{ color: 'var(--text-primary)' }}>
                    <span style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                      {percent}%
                    </span>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: -4 }}>
                      Verified
                    </div>
                  </div>
                )}
              />
              <div style={{ marginTop: 24, textAlign: 'center', width: '100%' }}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Statistic title="Enrolled" value={enrolledCount} valueStyle={{ color: '#45a29e', fontSize: 18, fontWeight: 'bold' }} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Verified" value={verifiedCount} valueStyle={{ color: 'cyan', fontSize: 18, fontWeight: 'bold' }} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Pending" value={pendingCount} valueStyle={{ color: '#ffa552', fontSize: 18, fontWeight: 'bold' }} />
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ color: 'var(--text-primary)' }}>Recently Onboarded Log</span>}
            style={{ background: 'var(--bg-container)', border: '1px solid var(--border-muted)', height: '100%' }}
          >
            <Table
              dataSource={students.slice(0, 5).map(s => ({ ...s, key: s.id }))}
              columns={columns}
              pagination={false}
              scroll={{ x: true }}
              style={{ background: 'transparent' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
