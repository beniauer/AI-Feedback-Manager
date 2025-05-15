
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { FeedbackItem } from '@/types/feedback';
import FeedbackDetail from '@/components/feedback/FeedbackDetail';
import FeedbackEntryItem from '@/components/feedback/FeedbackEntryItem';
import FeedbackFilter from '@/components/feedback/FeedbackFilter';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportFeedbackAsCSV } from '@/utils/feedbackUtils';
import { LoadingState, ErrorState, EmptyState } from '@/components/feedback/FeedbackStates';

const FeedbackInbox = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [dateFilter, setDateFilter] = useState<{from: Date | null, to: Date | null}>({
    from: null,
    to: null
  });
  
  const { data: feedbackData, isLoading, error, refetch } = useFeedbackData();

  const handleEntryClick = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsSheetOpen(true);
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExportCSV = () => {
    exportFeedbackAsCSV(feedbackData);
  };

  const filteredFeedback = React.useMemo(() => {
    if (!feedbackData) return [];
    
    let filtered = [...feedbackData];
    
    // Apply date filtering
    if (dateFilter.from || dateFilter.to) {
      filtered = filtered.filter(item => {
        const itemDate = item.Creation_Date ? new Date(item.Creation_Date) : null;
        if (!itemDate) return true;
        
        if (dateFilter.from && dateFilter.to) {
          return itemDate >= dateFilter.from && itemDate <= dateFilter.to;
        } else if (dateFilter.from) {
          return itemDate >= dateFilter.from;
        } else if (dateFilter.to) {
          return itemDate <= dateFilter.to;
        }
        return true;
      });
    }
    
    // Sort by creation date (newest first)
    return filtered.sort((a, b) => {
      const dateA = a.Creation_Date ? new Date(a.Creation_Date).getTime() : 0;
      const dateB = b.Creation_Date ? new Date(b.Creation_Date).getTime() : 0;
      return dateB - dateA;
    });
  }, [feedbackData, dateFilter]);

  // Get only the 5 newest items
  const newestFeedback = filteredFeedback.slice(0, 5);

  if (isLoading) {
    return <LoadingState title="Feedback Inbox" />;
  }

  if (error) {
    return <ErrorState title="Feedback Inbox" onRetry={refetch} />;
  }

  if (!feedbackData || feedbackData.length === 0) {
    return <EmptyState title="Feedback Inbox" onRefresh={refetch} />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Feedback Entries</CardTitle>
          <div className="flex items-center gap-2">
            <FeedbackFilter onFilterChange={setDateFilter} />
            <Button variant="outline" size="sm" className="h-8" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <div className="p-2 text-sm text-right text-muted-foreground border-b">
              Showing {newestFeedback.length} of {filteredFeedback.length} entries
            </div>
            {newestFeedback.map((feedback) => (
              <FeedbackEntryItem 
                key={feedback.UUID_Number}
                feedback={feedback}
                isExpanded={expandedItems[feedback.UUID_Number] || false}
                onToggleExpand={() => toggleExpand(feedback.UUID_Number)}
                onSelect={handleEntryClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          {selectedFeedback && (
            <FeedbackDetail feedback={selectedFeedback} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FeedbackInbox;
