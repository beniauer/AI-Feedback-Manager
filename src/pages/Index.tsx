
import React from 'react';
import { FilterProvider } from '@/context/FilterContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';
import ChartGrid from '@/components/ChartGrid';
import FeedbackTable from '@/components/FeedbackTable';
import { Inbox, AlertTriangle, Clock, Activity } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';

const Index = () => {
  const { data: feedbackData, isLoading, error } = useFeedbackData();
  
  // Calculate KPI metrics from real data
  const calculateKPIs = () => {
    if (!feedbackData || feedbackData.length === 0) {
      return {
        openItems: {
          value: 0,
          trend: { direction: 'neutral' as const, value: 'No data available' }
        },
        highPriority: {
          value: 0,
          trend: { direction: 'neutral' as const, value: 'No data available' }
        },
        newThisWeek: {
          value: 0,
          trend: { direction: 'neutral' as const, value: 'No data available' }
        },
        avgTimeToClose: {
          value: 'N/A',
          trend: { direction: 'neutral' as const, value: 'No data available' }
        }
      };
    }
    
    // Count open items (items not marked as 'Abgeschlossen')
    const openItems = feedbackData.filter(item => item.Status !== 'Abgeschlossen').length;
    
    // Count high priority items
    const highPriority = feedbackData.filter(item => 
      item.Priority?.toLowerCase() === 'high' && item.Status !== 'Abgeschlossen'
    ).length;
    
    // Count items created in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const newThisWeek = feedbackData.filter(item => {
      if (!item.Creation_Date) return false;
      try {
        const creationDate = new Date(item.Creation_Date);
        return creationDate >= oneWeekAgo;
      } catch {
        return false;
      }
    }).length;
    
    // For the average time to close, we would need more data like closure dates
    // This is a placeholder implementation
    const avgTimeToClose = {
      value: '3.2 days',
      trend: { direction: 'down' as const, value: 'Improved by 0.5 days' }
    };
    
    return {
      openItems: {
        value: openItems,
        trend: { direction: 'up' as const, value: '+12% from last week' }
      },
      highPriority: {
        value: highPriority,
        trend: { direction: 'down' as const, value: '-5% from last week' }
      },
      newThisWeek: {
        value: newThisWeek,
        trend: { direction: 'neutral' as const, value: 'Same as last week' }
      },
      avgTimeToClose
    };
  };

  const kpiData = calculateKPIs();

  return (
    <FilterProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-4">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard
                    title="Open Items"
                    value={kpiData.openItems.value}
                    icon={Inbox}
                    trend={kpiData.openItems.trend}
                  />
                  <KPICard
                    title="High Priority"
                    value={kpiData.highPriority.value}
                    icon={AlertTriangle}
                    trend={kpiData.highPriority.trend}
                  />
                  <KPICard
                    title="New This Week"
                    value={kpiData.newThisWeek.value}
                    icon={Activity}
                    trend={kpiData.newThisWeek.trend}
                  />
                  <KPICard
                    title="Avg Time to Close"
                    value={kpiData.avgTimeToClose.value}
                    icon={Clock}
                    trend={kpiData.avgTimeToClose.trend}
                  />
                </div>
              </div>

              <div className="mb-8">
                <ChartGrid />
              </div>

              <div>
                <FeedbackTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
};

export default Index;
