import React, { useState, useEffect } from 'react';
import { FeedbackItem } from '@/types/feedback';
import { formatDate, getTypeColor, toggleFeedbackSolvedStatus } from '@/utils/feedbackUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

interface FeedbackEntryItemProps {
  feedback: FeedbackItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelect: (feedback: FeedbackItem) => void;
}

const FeedbackEntryItem = ({ 
  feedback, 
  isExpanded, 
  onToggleExpand, 
  onSelect 
}: FeedbackEntryItemProps) => {
  const queryClient = useQueryClient();
  const [isSolved, setIsSolved] = useState(!!feedback.Solved);
  
  // Keep local state in sync with props
  useEffect(() => {
    setIsSolved(!!feedback.Solved);
  }, [feedback.Solved]);
  
  // Determine if there is a priority badge
  const getPriorityBadge = () => {
    const tags = feedback.Tags?.toLowerCase() || '';
    if (tags.includes('high priority')) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">high priority</Badge>;
    } else if (tags.includes('medium priority')) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">medium priority</Badge>;
    } else if (tags.includes('low priority')) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">low priority</Badge>;
    }
    return null;
  };

  // Handler for toggling solved status
  const handleSolvedToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Toggle solved button clicked for feedback:', feedback.UUID_Number);
    
    // Optimistically update the UI
    setIsSolved(!isSolved);
    
    // Call the API to update the solved status
    const success = await toggleFeedbackSolvedStatus(feedback.UUID_Number, isSolved);
    
    if (success) {
      console.log('Successfully toggled solved status, invalidating queries');
      // Force refresh all feedback data
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    } else {
      // Revert UI if the API call failed
      setIsSolved(isSolved);
    }
  };
  
  return (
    <div className={cn(
      "border-b last:border-0",
      isSolved ? 'bg-gray-50' : feedback.Status === 'Unread' ? 'bg-blue-50' : ''
    )}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={getTypeColor(feedback.Type)}>
                {feedback.Type?.toLowerCase() || 'unknown'}
              </Badge>
              {getPriorityBadge()}
              <span className="text-sm text-gray-500">{feedback.Product_Name} • {feedback.Market || 'Global'}</span>
            </div>
            <h3 className="text-base font-medium">
              {feedback.Feedback_Title || feedback.Summary || 'No Title'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              type="button"
              variant={isSolved ? "outline" : "destructive"}
              size="sm" 
              className={cn(
                "flex items-center gap-1 whitespace-nowrap",
                isSolved ? "border-green-500 text-green-600" : ""
              )}
              onClick={handleSolvedToggle}
            >
              {isSolved ? (
                <>
                  <CheckSquare className="h-4 w-4" />
                  <span>Solved</span>
                </>
              ) : (
                <>
                  <Square className="h-4 w-4" />
                  <span>Mark as solved</span>
                </>
              )}
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              onClick={onToggleExpand}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-2">
            <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
              {feedback.Full_Message || feedback.Summary || 'No details available'}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">{formatDate(feedback.Creation_Date)}</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto" 
                onClick={() => onSelect(feedback)}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackEntryItem;
