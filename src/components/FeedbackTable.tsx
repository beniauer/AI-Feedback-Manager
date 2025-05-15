
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
import { ArrowUp, ArrowDown, Download, Loader2, MessageCircle, CheckCircle } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { FeedbackItem } from '@/types/feedback';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FeedbackTable = () => {
  const [sortField, setSortField] = useState<keyof FeedbackItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const { data: feedbackData, isLoading, error, refetch } = useFeedbackData();

  const handleSort = (field: keyof FeedbackItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
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

  const handleRowClick = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsSheetOpen(true);
    
    // Mark as read if unread
    if (feedback.Status === 'Unread') {
      updateFeedbackStatus(feedback.UUID_Number, 'Read');
    }
  };

  const updateFeedbackStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('SFS Jun PM Feedback')
        .update({ Status: status })
        .eq('UUID_Number', id);
      
      if (error) throw error;
      
      refetch();
      
      toast({
        title: "Status Updated",
        description: `Feedback status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update feedback status",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsReplied = async () => {
    if (!selectedFeedback) return;
    
    try {
      const { error } = await supabase
        .from('SFS Jun PM Feedback')
        .update({ Replied: true, Status: 'Replied' })
        .eq('UUID_Number', selectedFeedback.UUID_Number);
      
      if (error) throw error;
      
      refetch();
      
      toast({
        title: "Marked as Replied",
        description: "Feedback has been marked as replied",
      });
    } catch (error) {
      console.error('Error updating replied status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to mark feedback as replied",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsSolved = async () => {
    if (!selectedFeedback) return;
    
    try {
      const { error } = await supabase
        .from('SFS Jun PM Feedback')
        .update({ Solved: true, Status: 'Solved' })
        .eq('UUID_Number', selectedFeedback.UUID_Number);
      
      if (error) throw error;
      
      refetch();
      
      toast({
        title: "Marked as Solved",
        description: "Feedback has been marked as solved",
      });
    } catch (error) {
      console.error('Error updating solved status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to mark feedback as solved",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'unread': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'replied': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'solved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'bug': return 'bg-red-100 text-red-800 border-red-200';
      case 'feature request': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'question': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'feedback': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleExportCSV = () => {
    if (!feedbackData || feedbackData.length === 0) {
      toast({
        title: "Export Error",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate CSV content
      const headers = Object.keys(feedbackData[0]).join(',');
      const rows = feedbackData.map(item => 
        Object.values(item).map(val => 
          typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(',')
      ).join('\n');
      
      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'feedback_export.csv';
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your data has been exported as CSV",
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Feedback List</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff0105]" />
          <span className="ml-2 text-lg text-muted-foreground">Loading data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Feedback List</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <p className="text-red-500 mb-2">Error loading feedback data</p>
          <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
        </CardContent>
      </Card>
    );
  }

  if (!feedbackData || feedbackData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Feedback List</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <p className="text-lg mb-2">No feedback data available</p>
          <p className="text-sm text-muted-foreground">Check your Supabase connection or add some data to get started</p>
        </CardContent>
      </Card>
    );
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
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Feedback_Title' as keyof FeedbackItem)}
                  >
                    Feedback
                    {sortField === 'Feedback_Title' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Product_Name' as keyof FeedbackItem)}
                  >
                    Product
                    {sortField === 'Product_Name' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Type' as keyof FeedbackItem)}
                  >
                    Type
                    {sortField === 'Type' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Status' as keyof FeedbackItem)}
                  >
                    Status
                    {sortField === 'Status' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Creation_Date' as keyof FeedbackItem)}
                  >
                    Date
                    {sortField === 'Creation_Date' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((feedback) => (
                  <TableRow 
                    key={feedback.UUID_Number} 
                    className={`cursor-pointer hover:bg-muted/50 ${feedback.Status === 'Unread' ? 'font-medium' : ''}`}
                    onClick={() => handleRowClick(feedback)}
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          {selectedFeedback && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedFeedback.Feedback_Title || selectedFeedback.Summary || 'No Title'}</SheetTitle>
                <SheetDescription>
                  From {selectedFeedback.Sales_Sender || 'Unknown'} • {formatDate(selectedFeedback.Creation_Date)}
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Product</p>
                    <p className="text-sm">{selectedFeedback.Product_Name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Market</p>
                    <p className="text-sm">{selectedFeedback.Market || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Type</p>
                    <Badge variant="outline" className={getTypeColor(selectedFeedback.Type)}>
                      {selectedFeedback.Type || 'Unknown'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Status</p>
                    <Badge variant="outline" className={getStatusColor(selectedFeedback.Status)}>
                      {selectedFeedback.Status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedFeedback.Tags ? 
                      selectedFeedback.Tags.split(',').map((tag, index) => (
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
                    <p className="text-sm whitespace-pre-line">{selectedFeedback.Full_Message || 'No message content'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Update Status</p>
                <Select 
                  defaultValue={selectedFeedback.Status || 'Unread'} 
                  onValueChange={(value) => updateFeedbackStatus(selectedFeedback.UUID_Number, value)}
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
                  disabled={selectedFeedback.Replied}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Mark as Replied
                </Button>
                <Button 
                  className="flex-1 bg-[#ff0105] hover:bg-[#dd0104]" 
                  onClick={handleMarkAsSolved}
                  disabled={selectedFeedback.Solved}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Solved
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FeedbackTable;
