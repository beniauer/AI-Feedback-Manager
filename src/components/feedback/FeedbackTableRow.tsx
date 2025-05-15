
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FeedbackItem } from '@/types/feedback';
import { getStatusColor, getTypeColor, formatDate } from '@/utils/feedbackUtils';

interface FeedbackTableRowProps {
  feedback: FeedbackItem;
  onClick: (feedback: FeedbackItem) => void;
}

const FeedbackTableRow = ({ feedback, onClick }: FeedbackTableRowProps) => {
  return (
    <TableRow 
      key={feedback.UUID_Number} 
      className={`cursor-pointer hover:bg-muted/50 ${feedback.Status === 'Unread' ? 'font-medium' : ''}`}
      onClick={() => onClick(feedback)}
    >
      <TableCell>
        {feedback.Feedback_Title || feedback.Summary || 'No Title'}
      </TableCell>
      <TableCell>{feedback.Product_Name || 'N/A'}</TableCell>
      <TableCell>
        <Badge variant="outline" className={getTypeColor(feedback.Type)}>
          {feedback.Type || 'Unknown'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getStatusColor(feedback.Status)}>
          {feedback.Status || 'Unknown'}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(feedback.Creation_Date)}
      </TableCell>
    </TableRow>
  );
};

export default FeedbackTableRow;
