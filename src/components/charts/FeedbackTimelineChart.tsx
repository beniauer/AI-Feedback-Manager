
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { format, subDays, parseISO } from 'date-fns';

const FeedbackTimelineChart = () => {
  const { data: feedbackData } = useFeedbackData();
  
  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!feedbackData || feedbackData.length === 0) {
      // Generate sample data
      return Array.from({ length: 7 }).map((_, i) => {
        const date = format(subDays(new Date(), 6 - i), 'MMM dd');
        return {
          date,
          'Product A': Math.floor(Math.random() * 5),
          'Product B': Math.floor(Math.random() * 5),
          'Product C': Math.floor(Math.random() * 5),
        };
      });
    }
    
    // Get unique products
    const products = [...new Set(feedbackData.map(item => item.Product_Name).filter(Boolean))];
    
    // Group feedbacks by date and product
    const groupedByDate: Record<string, Record<string, number>> = {};
    
    feedbackData.forEach(item => {
      if (!item.Creation_Date || !item.Product_Name) return;
      
      try {
        const dateStr = format(parseISO(item.Creation_Date), 'MMM dd');
        if (!groupedByDate[dateStr]) {
          groupedByDate[dateStr] = {};
        }
        groupedByDate[dateStr][item.Product_Name] = (groupedByDate[dateStr][item.Product_Name] || 0) + 1;
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    // Generate data for the last 7 days
    return Array.from({ length: 7 }).map((_, i) => {
      const date = format(subDays(new Date(), 6 - i), 'MMM dd');
      const entry: Record<string, any> = { date };
      
      // Add count for each product
      products.forEach(product => {
        if (product) {
          entry[product] = (groupedByDate[date]?.[product]) || 0;
        }
      });
      
      return entry;
    });
  }, [feedbackData]);
  
  // Extract product names for the bars
  const productKeys = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    return Object.keys(chartData[0]).filter(key => key !== 'date');
  }, [chartData]);
  
  const COLORS = ['#ff0105', '#ff6b6c', '#ffb3b3', '#a1a1aa', '#d1d1d9'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {productKeys.map((product, index) => (
          <Bar 
            key={product}
            dataKey={product} 
            stackId="a"
            fill={COLORS[index % COLORS.length]} 
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default FeedbackTimelineChart;
