
import React from 'react';
import { FilterProvider } from '@/context/FilterContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';
import ChartGrid from '@/components/ChartGrid';
import FeedbackTable from '@/components/FeedbackTable';
import { Inbox, AlertTriangle, Clock, Activity } from 'lucide-react';

const Index = () => {
  // In a real app, this data would come from API/database
  const kpiData = {
    openItems: {
      value: 124,
      trend: { direction: 'up', value: '+12% from last week' }
    },
    highPriority: {
      value: 28,
      trend: { direction: 'down', value: '-5% from last week' }
    },
    newThisWeek: {
      value: 45,
      trend: { direction: 'neutral', value: 'Same as last week' }
    },
    avgTimeToClose: {
      value: '3.2 days',
      trend: { direction: 'down', value: 'Improved by 0.5 days' }
    }
  };

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
