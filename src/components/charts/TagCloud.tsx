
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for tags
const mockTags = [
  { text: 'Performance', value: 38 },
  { text: 'UX', value: 30 },
  { text: 'Security', value: 28 },
  { text: 'API', value: 25 },
  { text: 'Mobile', value: 22 },
  { text: 'Speed', value: 18 },
  { text: 'Dashboard', value: 16 },
  { text: 'Integration', value: 15 },
  { text: 'Login', value: 14 },
  { text: 'Reports', value: 12 },
  { text: 'Pricing', value: 10 },
  { text: 'Notifications', value: 10 },
  { text: 'Export', value: 8 },
  { text: 'Settings', value: 8 },
  { text: 'Analytics', value: 6 },
];

// Calculate tag size based on value
const getTagSize = (value: number) => {
  const minValue = Math.min(...mockTags.map(tag => tag.value));
  const maxValue = Math.max(...mockTags.map(tag => tag.value));
  const minSize = 12;
  const maxSize = 28;
  
  // Linear interpolation between minSize and maxSize
  return minSize + ((value - minValue) * (maxSize - minSize)) / (maxValue - minValue);
};

// Get a color from a predefined array based on the value
const getTagColor = (value: number) => {
  const colors = [
    '#BFDBFE', // blue-200
    '#93C5FD', // blue-300
    '#60A5FA', // blue-400
    '#3B82F6', // blue-500
    '#2563EB', // blue-600
    '#ff0105',  // brand-primary
  ];
  
  const minValue = Math.min(...mockTags.map(tag => tag.value));
  const maxValue = Math.max(...mockTags.map(tag => tag.value));
  
  // Calculate the index in the color array
  const index = Math.floor(((value - minValue) / (maxValue - minValue)) * (colors.length - 1));
  return colors[index];
};

const TagCloud = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">Popular Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container overflow-hidden flex items-center justify-center">
          <div className="flex flex-wrap justify-center items-center gap-2">
            {mockTags.map((tag, index) => (
              <span
                key={index}
                className="inline-block rounded-full px-3 py-1"
                style={{
                  fontSize: `${getTagSize(tag.value)}px`,
                  backgroundColor: getTagColor(tag.value),
                  color: tag.value > 20 ? 'white' : 'black',
                  opacity: 0.7 + (tag.value / 100),
                }}
              >
                {tag.text}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TagCloud;
