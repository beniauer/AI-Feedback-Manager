
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data - would be replaced with real data from API
const mockData = [
  {
    product: 'Web App',
    Problem: 40,
    'Feature Request': 24,
    Price: 10,
    Competition: 8,
  },
  {
    product: 'Mobile App',
    Problem: 30,
    'Feature Request': 18,
    Price: 12,
    Competition: 5,
  },
  {
    product: 'Desktop App',
    Problem: 20,
    'Feature Request': 28,
    Price: 8,
    Competition: 3,
  },
  {
    product: 'API',
    Problem: 27,
    'Feature Request': 17,
    Price: 10,
    Competition: 6,
  },
];

const typeColors = {
  Problem: '#ea5545',
  'Feature Request': '#f46a9b',
  Price: '#edbf33',
  Competition: '#87bc45',
};

const StackedBarChart = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">Feedback by Product & Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="product"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f1f1',
                }}
              />
              <Legend iconType="circle" />
              {Object.keys(typeColors).map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={typeColors[key as keyof typeof typeColors]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StackedBarChart;
