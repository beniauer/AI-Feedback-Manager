
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';

interface LoadingStateProps {
  title: string;
}

export const LoadingState = ({ title }: LoadingStateProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-[#ff0105]" />
      <span className="ml-2 text-lg text-muted-foreground">Loading data...</span>
    </CardContent>
  </Card>
);

interface ErrorStateProps {
  title: string;
  onRetry: () => void;
}

export const ErrorState = ({ title, onRetry }: ErrorStateProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="py-10 text-center">
      <p className="text-red-500 mb-2">Error loading feedback data</p>
      <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
      <Button onClick={onRetry} className="mt-4">
        Retry
      </Button>
    </CardContent>
  </Card>
);

interface EmptyStateProps {
  title: string;
  onRefresh: () => void;
}

export const EmptyState = ({ title, onRefresh }: EmptyStateProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="py-10 text-center">
      <p className="text-lg mb-2">No feedback data available</p>
      <p className="text-sm text-muted-foreground">Check your Supabase connection or add some data to get started</p>
      <Button onClick={onRefresh} className="mt-4">
        Refresh Data
      </Button>
    </CardContent>
  </Card>
);
