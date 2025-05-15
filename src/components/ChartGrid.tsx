
import React from 'react';
import StackedBarChart from './charts/StackedBarChart';
import LineChart from './charts/LineChart';
import DonutChart from './charts/DonutChart';
import TagCloud from './charts/TagCloud';

const ChartGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StackedBarChart />
      <LineChart />
      <DonutChart />
      <TagCloud />
    </div>
  );
};

export default ChartGrid;
