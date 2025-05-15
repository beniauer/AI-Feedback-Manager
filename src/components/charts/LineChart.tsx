
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { subDays, format } from 'date-fns';

// Generate mock data for the last 30 days
const generateMockData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'MMM dd'),
      count: Math.floor(Math.random() * 50) + 10, // Random number between 10 and 60
    });
  }
  return data;
};

const mockData = generateMockData();

const LineChart = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">Daily Feedback Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
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
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
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
              <Line
                type="monotone"
                dataKey="count"
                stroke="#ff0105"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, stroke: '#ff0105', strokeWidth: 2, fill: 'white' }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
