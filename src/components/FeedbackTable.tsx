
import React, { useState } from 'react';
import {
  Table,
  TableBody,
} from '@/components/ui/table';
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
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { FeedbackItem } from '@/types/feedback';
import { updateFeedbackStatus, exportFeedbackAsCSV } from '@/utils/feedbackUtils';
import FeedbackTableHeader from '@/components/feedback/FeedbackTableHeader';
import FeedbackTableRow from '@/components/feedback/FeedbackTableRow';
import FeedbackDetail from '@/components/feedback/FeedbackDetail';
import { LoadingState, ErrorState, EmptyState } from '@/components/feedback/FeedbackStates';
import { useFeedbackSort } from '@/hooks/useFeedbackSort';

const FeedbackTable = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const { data: feedbackData, isLoading, error, refetch } = useFeedbackData();
  const { sortField, sortDirection, handleSort, sortedData } = useFeedbackSort(feedbackData);

  const handleRowClick = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsSheetOpen(true);
    
    // Mark as read if unread
    if (feedback.Status === 'Unread') {
      updateFeedbackStatus(feedback.UUID_Number, 'Read');
    }
  };

  const handleExportCSV = () => {
    exportFeedbackAsCSV(feedbackData);
  };

  if (isLoading) {
    return <LoadingState title="Feedback List" />;
  }

  if (error) {
    return <ErrorState title="Feedback List" onRetry={refetch} />;
  }

  if (!feedbackData || feedbackData.length === 0) {
    return <EmptyState title="Feedback List" onRefresh={refetch} />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Feedback List</CardTitle>
          <Button variant="outline" size="sm" className="h-8" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <FeedbackTableHeader 
                sortField={sortField} 
                sortDirection={sortDirection} 
                onSort={handleSort} 
              />
              <TableBody>
                {sortedData.map((feedback) => (
                  <FeedbackTableRow 
                    key={feedback.UUID_Number} 
                    feedback={feedback} 
                    onClick={handleRowClick} 
                  />
                ))}
              </TableBody>
            </Table>
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

export default FeedbackTable;
