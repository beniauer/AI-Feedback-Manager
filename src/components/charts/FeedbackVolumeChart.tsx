
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { format, subDays, parseISO } from 'date-fns';

const FeedbackVolumeChart = () => {
  const { data: feedbackData } = useFeedbackData();
  
  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!feedbackData || feedbackData.length === 0) {
      // Generate sample data if no feedback data is available
      return Array.from({ length: 14 }).map((_, i) => ({
        date: format(subDays(new Date(), 13 - i), 'MMM dd'),
        count: Math.floor(Math.random() * 10)
      }));
    }
    
    // Group feedbacks by date
    const grouped = feedbackData.reduce((acc, item) => {
      if (!item.Creation_Date) return acc;
      
      try {
        const dateStr = format(parseISO(item.Creation_Date), 'MMM dd');
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        return acc;
      } catch (e) {
        return acc;
      }
    }, {} as Record<string, number>);
    
    // Generate data for the last 14 days
    return Array.from({ length: 14 }).map((_, i) => {
      const date = format(subDays(new Date(), 13 - i), 'MMM dd');
      return {
        date,
        count: grouped[date] || 0
      };
    });
  }, [feedbackData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#ff0105" 
          activeDot={{ r: 8 }} 
          name="Feedback Count" 
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default FeedbackVolumeChart;
