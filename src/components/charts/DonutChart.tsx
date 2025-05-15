
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

// Mock data
const mockData = [
  { name: 'High', value: 35, color: '#ea5545' },
  { name: 'Medium', value: 45, color: '#f46a9b' },
  { name: 'Low', value: 20, color: '#edbf33' },
];

const DonutChart = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">Priority Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Tooltip
                formatter={(value) => [`${value} items`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f1f1',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutChart;
