
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

interface FeedbackTypesByProductChartProps {
  productName?: string;
}

const FeedbackTypesByProductChart = ({ productName }: FeedbackTypesByProductChartProps) => {
  const { data: feedbackData } = useFeedbackData();
  
  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!feedbackData || feedbackData.length === 0) {
      // Sample data
      return [
        { name: 'Bug', value: 5, color: '#6050DC' },
        { name: 'Feature', value: 7, color: '#D52DB7' },
        { name: 'Question', value: 3, color: '#FF6B45' },
        { name: 'Other', value: 2, color: '#FFAB05' }
      ];
    }
    
    // Filter by product if specified
    const filteredData = productName 
      ? feedbackData.filter(item => item.Product_Name === productName)
      : feedbackData;
    
    // Group feedbacks by type
    const grouped = filteredData.reduce((acc, item) => {
      const type = item.Type || 'Uncategorized';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Map to chart data format with colors
    return Object.entries(grouped).map(([name, value]) => {
      let color;
      switch (name.toLowerCase()) {
        case 'complaint': color = '#6050DC'; break;
        case 'suggestion': color = '#D52DB7'; break;
        case 'praise': color = '#FF2E7E'; break;
        case 'question': color = '#FF6B45'; break;
        case 'price': color = '#FFAB05'; break;
        case 'competitor': color = '#FFF79C'; break;
        case 'bug': color = '#6050DC'; break;
        case 'feature request': color = '#D52DB7'; break;
        default: color = '#a1a1aa'; break;
      }
      
      return { name, value, color };
    });
  }, [feedbackData, productName]);

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
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default FeedbackTypesByProductChart;
