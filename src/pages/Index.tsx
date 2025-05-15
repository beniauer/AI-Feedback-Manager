
import React from 'react';
import { FilterProvider } from '@/context/FilterContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import InboxOverview from '@/components/InboxOverview';
import FeedbackTable from '@/components/FeedbackTable';
import AnalyticsSection from '@/components/AnalyticsSection';

const Index = () => {
  return (
    <FilterProvider>
      <div className="min-h-screen flex flex-col bg-[#fcfbf8]">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-4">
            <div className="container mx-auto max-w-7xl space-y-6">
              <InboxOverview />
              <AnalyticsSection />
              <FeedbackTable />
            </div>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
};

export default Index;
