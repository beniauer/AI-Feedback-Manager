
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
        { name: 'Complaint', value: 5 },
        { name: 'Suggestion', value: 7 },
        { name: 'Problem', value: 3 },
        { name: 'Feature Request', value: 4 },
        { name: 'Price', value: 2 },
        { name: 'Competition', value: 1 }
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

  // Custom label component that uses white text for better visibility on colored backgrounds
  const renderCustomizedLabel = ({ name, percent, x, y, midAngle }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 80;
    const innerRadius = 40;
    const outerRadius = 80;
    const cx = x;
    const cy = y;
    
    // Calculate position for the label
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    
    return (
      <text 
        x={mx} 
        y={my} 
        fill="white" 
        textAnchor={mx > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColorForType(entry.name)} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default FeedbackTypesChart;
