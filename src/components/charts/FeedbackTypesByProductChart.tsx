
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
  
  // Colors for different feedback types
  const getColorForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bug': return '#ef4444';
      case 'feature request': return '#f97316';
      case 'ux issue': return '#ec4899';
      case 'performance': return '#eab308';
      case 'documentation': return '#0ea5e9';
      case 'question': return '#3b82f6';
      case 'feedback': return '#8b5cf6';
      case 'issue': return '#f59e0b';
      case 'suggestion': return '#14b8a6';
      case 'improvement': return '#6366f1';
      case 'critical': return '#e11d48';
      case 'enhancement': return '#10b981';
      default: return '#a1a1aa';
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
