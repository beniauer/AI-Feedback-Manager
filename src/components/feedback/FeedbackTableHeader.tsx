
import React from 'react';
import { TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { FeedbackItem } from '@/types/feedback';

interface FeedbackTableHeaderProps {
  sortField: keyof FeedbackItem | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof FeedbackItem) => void;
}

const FeedbackTableHeader = ({ sortField, sortDirection, onSort }: FeedbackTableHeaderProps) => {
  const renderSortIcon = (field: keyof FeedbackItem) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 
        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
        <ArrowDown className="h-4 w-4 inline ml-1" />;
    }
    return null;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('Feedback_Title' as keyof FeedbackItem)}
        >
          Feedback
          {renderSortIcon('Feedback_Title' as keyof FeedbackItem)}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('Product_Name' as keyof FeedbackItem)}
        >
          Product
          {renderSortIcon('Product_Name' as keyof FeedbackItem)}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('Type' as keyof FeedbackItem)}
        >
          Type
          {renderSortIcon('Type' as keyof FeedbackItem)}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('Status' as keyof FeedbackItem)}
        >
          Status
          {renderSortIcon('Status' as keyof FeedbackItem)}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('Creation_Date' as keyof FeedbackItem)}
        >
          Date
          {renderSortIcon('Creation_Date' as keyof FeedbackItem)}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default FeedbackTableHeader;
