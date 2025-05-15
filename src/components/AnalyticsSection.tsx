
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart } from 'lucide-react';
import FeedbackVolumeChart from '@/components/charts/FeedbackVolumeChart';
import FeedbackTypesChart from '@/components/charts/FeedbackTypesChart';
import FeedbackTimelineChart from '@/components/charts/FeedbackTimelineChart';

const AnalyticsSection = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="volume">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="volume" className="flex items-center gap-2">
              <LineChart className="w-4 h-4" />
              <span>Volume Over Time</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              <span>Timeline View</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              <span>Feedback Distribution</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="volume">
            <div className="h-80">
              <FeedbackVolumeChart />
            </div>
          </TabsContent>
          <TabsContent value="timeline">
            <div className="h-80">
              <FeedbackTimelineChart />
            </div>
          </TabsContent>
          <TabsContent value="distribution">
            <div className="h-80">
              <FeedbackTypesChart />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
