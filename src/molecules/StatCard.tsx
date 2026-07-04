import React from 'react';
import { Card, Statistic } from 'antd';

interface StatCardProps {
  title: React.ReactNode;
  value: number | string;
  valueStyle?: React.CSSProperties;
  suffix?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, valueStyle, suffix }) => {
  return (
    <Card style={{ background: 'var(--bg-container)', border: '1px solid var(--border-muted)' }}>
      <Statistic
        title={title}
        value={value}
        valueStyle={{
          color: 'var(--text-primary)',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          ...valueStyle
        }}
        suffix={suffix}
      />
    </Card>
  );
};
