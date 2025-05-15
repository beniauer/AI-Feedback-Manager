
import { useState, useMemo } from 'react';
import { FeedbackItem } from '@/types/feedback';

export function useFeedbackSort(feedbackData: FeedbackItem[] | undefined) {
  const [sortField, setSortField] = useState<keyof FeedbackItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof FeedbackItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!feedbackData) return [];
    
    return [...feedbackData].sort((a, b) => {
      if (!sortField) return 0;
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [feedbackData, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedData
  };
}
