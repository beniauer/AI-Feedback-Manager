
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

const FeedbackTypesByProductChart = ({ productName }: { productName?: string }) => {
  const { data: feedbackData } = useFeedbackData();
  
  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!feedbackData || feedbackData.length === 0) {
      // Sample data
      return [
        { name: 'Bug', value: 2 },
        { name: 'Feature Request', value: 3 },
        { name: 'Question', value: 1 },
      ];
    }
    
    // Filter by product if specified
    let filteredData = feedbackData;
    if (productName) {
      filteredData = feedbackData.filter(item => item.Product_Name === productName);
    }
    
    // Group feedbacks by type
    const grouped = filteredData.reduce((acc, item) => {
      const type = item.Type || 'Uncategorized';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [feedbackData, productName]);
  
  // Updated colors based on provided image
  const getColorForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bug': return '#6050DC'; // Majorelle Blue
      case 'feature request': return '#D52DB7'; // Steel Pink
      case 'ux issue': return '#FF2E7E'; // Electric Pink
      case 'performance': return '#FF6B45'; // Outrageous Orange
      case 'documentation': return '#FFAB05'; // Chrome Yellow
      case 'question': return '#6050DC'; // Majorelle Blue
      case 'feedback': return '#D52DB7'; // Steel Pink
      case 'issue': return '#FF2E7E'; // Electric Pink
      case 'suggestion': return '#FF6B45'; // Outrageous Orange
      case 'improvement': return '#FFAB05'; // Chrome Yellow
      case 'critical': return '#FF2E7E'; // Electric Pink
      case 'enhancement': return '#D52DB7'; // Steel Pink
      default: return '#a1a1aa'; // Default gray
    }
  };

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

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
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={getColorForType(entry.name)} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default FeedbackTypesByProductChart;
