
import React from 'react';
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle } from 'lucide-react';
import { FeedbackItem } from '@/types/feedback';
import { useQueryClient } from '@tanstack/react-query';
import {
  getStatusColor,
  getTypeColor,
  formatDate,
  updateFeedbackStatus,
  markFeedbackAsReplied,
  toggleFeedbackSolvedStatus,
} from '@/utils/feedbackUtils';

interface FeedbackDetailProps {
  feedback: FeedbackItem;
}

const FeedbackDetail = ({ feedback }: FeedbackDetailProps) => {
  const queryClient = useQueryClient();
  const [isSolved, setIsSolved] = React.useState(!!feedback.Solved);
  
  React.useEffect(() => {
    // Update local state when feedback prop changes
    setIsSolved(!!feedback.Solved);
  }, [feedback.Solved]);
  
  const handleStatusChange = async (value: string) => {
    const success = await updateFeedbackStatus(feedback.UUID_Number, value);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    }
  };

  const handleMarkAsReplied = async () => {
    const success = await markFeedbackAsReplied(feedback.UUID_Number);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    }
  };

  const handleMarkAsSolved = async () => {
    console.log('Mark as solved clicked, current status:', isSolved);
    
    // Optimistically update UI
    setIsSolved(!isSolved);
    
    // Call API to update database
    const success = await toggleFeedbackSolvedStatus(feedback.UUID_Number, isSolved);
    
    if (success) {
      // Refresh data from server
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    } else {
      // Revert UI if failed
      setIsSolved(isSolved);
    }
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>{feedback.Feedback_Title || feedback.Summary || 'No Title'}</SheetTitle>
        <SheetDescription>
          From {feedback.Sales_Sender || 'Unknown'} • {formatDate(feedback.Creation_Date)}
        </SheetDescription>
      </SheetHeader>
      
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium mb-1">Product</p>
            <p className="text-sm">{feedback.Product_Name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Market</p>
            <p className="text-sm">{feedback.Market || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Type</p>
            <Badge variant="outline" className={getTypeColor(feedback.Type)}>
              {feedback.Type || 'Unknown'}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <Badge variant="outline" className={getStatusColor(feedback.Status)}>
              {feedback.Status || 'Unknown'}
            </Badge>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Tags</p>
          <div className="flex flex-wrap gap-1">
            {feedback.Tags ? 
              feedback.Tags.split(',').map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100 border-gray-200">
                  {tag.trim()}
                </Badge>
              ))
              : <span className="text-sm text-muted-foreground">No tags</span>
            }
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Message</p>
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm whitespace-pre-line">{feedback.Full_Message || 'No message content'}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm font-medium mb-2">Update Status</p>
        <Select 
          defaultValue={feedback.Status || 'Unread'} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Unread">Unread</SelectItem>
            <SelectItem value="Read">Read</SelectItem>
            <SelectItem value="Replied">Replied</SelectItem>
            <SelectItem value="Solved">Solved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <SheetFooter className="mt-6 flex-row space-x-2">
        <Button 
          className="flex-1" 
          variant="outline"
          onClick={handleMarkAsReplied}
          disabled={feedback.Replied}
          type="button"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Mark as Replied
        </Button>
        <Button 
          className={isSolved ? "flex-1 bg-green-600 hover:bg-green-700" : "flex-1 bg-[#ff0105] hover:bg-[#dd0104]"}
          onClick={handleMarkAsSolved}
          type="button"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isSolved ? "Solved" : "Mark as Solved"}
        </Button>
      </SheetFooter>
    </>
  );
};

export default FeedbackDetail;
