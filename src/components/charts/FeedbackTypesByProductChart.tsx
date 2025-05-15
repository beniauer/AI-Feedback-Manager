
import React from 'react';
import {
  PieChart,
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

  const chartData = React.useMemo(() => {
    if (!feedbackData || feedbackData.length === 0) {
      // Sample data
      return [
        { name: 'Complaint', value: 2 },
        { name: 'Suggestion', value: 3 },
        { name: 'Problem', value: 1 },
        { name: 'Feature Request', value: 4 },
        { name: 'Price', value: 2 },
        { name: 'Competition', value: 1 }
      ];
    }

    // Filter by product if specified
    let filteredData = feedbackData;
    if (productName) {
      filteredData = feedbackData.filter(
        (item) => item.Product_Name === productName
      );
    }

    // Group by feedback type
    const groupedByType = filteredData.reduce((acc, item) => {
      const type = item.Type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedByType).map(([name, value]) => ({
      name,
      value,
    }));
  }, [feedbackData, productName]);

  // Use the specified color palette
  const COLOR_MAP: Record<string, string> = {
    'complaint': '#6050DC',
    'suggestion': '#D52DB7',
    'problem': '#FF2E7E',
    'feature request': '#FF6B45',
    'price': '#FFAB05',
    'competition': '#FFF79C',
    // Fallback colors for other types
    'bug': '#6050DC',
    'ux issue': '#FF2E7E',
    'performance': '#FF6B45',
    'documentation': '#FFAB05',
  };
  
  // Default colors for types not in the map
  const DEFAULT_COLORS = ['#6050DC', '#D52DB7', '#FF2E7E', '#FF6B45', '#FFAB05', '#FFF79C'];

  const getColorForType = (type: string): string => {
    const normalizedType = type.toLowerCase();
    return COLOR_MAP[normalizedType] || DEFAULT_COLORS[chartData.findIndex(item => item.name.toLowerCase() === normalizedType) % DEFAULT_COLORS.length];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
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
            <Cell key={`cell-${index}`} fill={getColorForType(entry.name)} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default FeedbackTypesByProductChart;
