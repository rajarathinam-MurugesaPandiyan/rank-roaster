import React from 'react';
import { Card, Space, Typography } from 'antd';
import { BookOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ClassItem } from '../redux/schoolSlice';

const { Text } = Typography;

interface ClassCardProps {
  cls: ClassItem;
}

export const ClassCard: React.FC<ClassCardProps> = ({ cls }) => {
  return (
    <Card
      className="glass-panel"
      style={{
        background: 'var(--bg-container)',
        border: '1px solid var(--border-muted)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      <div style={{ flexGrow: 1 }}>
        <Space align="start" size={12} style={{ marginBottom: 16 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'rgba(69, 162, 158, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOutlined style={{ fontSize: 18, color: '#45a29e' }} />
          </div>
          <div>
            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>{cls.grade}</Text>
            <Text strong style={{ fontSize: 16, color: 'var(--text-primary)', display: 'block', lineHeight: '1.3' }}>
              {cls.className}
            </Text>
          </div>
        </Space>

        <Space direction="vertical" size={8} style={{ width: '100%', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined style={{ color: 'var(--text-secondary)', fontSize: 12 }} />
            <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{cls.teacher}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClockCircleOutlined style={{ color: 'var(--text-secondary)', fontSize: 12 }} />
            <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{cls.schedule}</Text>
          </div>
        </Space>
      </div>

      <div style={{
        borderTop: '1px solid var(--border-muted)',
        marginTop: 20,
        paddingTop: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Enrollment</Text>
        <Text strong style={{ color: '#ffa552', fontFamily: 'var(--font-display)', fontSize: 15 }}>
          {cls.studentsCount} Students
        </Text>
      </div>
    </Card>
  );
};
