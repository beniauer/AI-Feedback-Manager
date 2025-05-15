
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useFeedbackData } from '@/hooks/useFeedbackData';

const FeedbackTypesChart = () => {
  const { data: feedbackData } = useFeedbackData();
  
  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!feedbackData || feedbackData.length === 0) {
      // Sample data
      return [
        { name: 'Bug', value: 5 },
        { name: 'Feature', value: 7 },
        { name: 'Question', value: 3 },
        { name: 'Other', value: 2 }
      ];
    }
    
    // Group feedbacks by type
    const grouped = feedbackData.reduce((acc, item) => {
      const type = item.Type || 'Uncategorized';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [feedbackData]);
  
  const COLORS = ['#ff0105', '#ff6b6c', '#ffb3b3', '#a1a1aa', '#d1d1d9'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default FeedbackTypesChart;
