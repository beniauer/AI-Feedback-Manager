
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
import { ArrowUp, ArrowDown, Download, Loader2 } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { FeedbackItem } from '@/types/feedback';
import { toast } from '@/components/ui/use-toast';

const FeedbackTable = () => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const { data: feedbackData, isLoading, error } = useFeedbackData();

  const handleSort = (field: string) => {
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
      
      const aValue = a[sortField as keyof FeedbackItem];
      const bValue = b[sortField as keyof FeedbackItem];
      
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
  };

  const handleStatusChange = (value: string) => {
    if (selectedFeedback) {
      toast({
        title: "Status Updated",
        description: `Feedback status changed to ${value}`,
      });
      // In a real app, we would update the status in the database
      // This would require setting up an RLS policy for updates in Supabase
    }
  };

  const getPriorityColor = (priority: string = '') => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusColor = (status: string = '') => {
    switch (status?.toLowerCase()) {
      case 'inbox': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'analyse': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'abgeschlossen': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString; // If parsing fails, return the original string
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
          <CardTitle className="text-base font-medium">Feedback Details</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-lg text-muted-foreground">Loading data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Feedback Details</CardTitle>
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
          <CardTitle className="text-base font-medium">Feedback Details</CardTitle>
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
          <CardTitle className="text-base font-medium">Feedback Details</CardTitle>
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
                    onClick={() => handleSort('Summary')}
                  >
                    Summary
                    {sortField === 'Summary' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Market')}
                  >
                    Market
                    {sortField === 'Market' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Priority')}
                  >
                    Priority
                    {sortField === 'Priority' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Sales_Sender')}
                  >
                    Sender
                    {sortField === 'Sales_Sender' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('Status')}
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
                    onClick={() => handleSort('Creation_Date')}
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
                    key={feedback.Id_No} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(feedback)}
                  >
                    <TableCell className="font-medium">{feedback.Summary || 'N/A'}</TableCell>
                    <TableCell>{feedback.Market || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getPriorityColor(feedback.Priority)}`}>
                        {feedback.Priority || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>{feedback.Sales_Sender || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(feedback.Status)}`}>
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
                <SheetTitle>{selectedFeedback.Summary || 'No Summary'}</SheetTitle>
                <SheetDescription>
                  From {selectedFeedback.Sales_Sender || 'Unknown'} on {formatDate(selectedFeedback.Creation_Date)}
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
                    <p className="text-sm">{selectedFeedback.Type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Priority</p>
                    <Badge variant="outline" className={`${getPriorityColor(selectedFeedback.Priority)}`}>
                      {selectedFeedback.Priority || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedFeedback.Tags ? 
                      selectedFeedback.Tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="outline">
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
                <p className="text-sm font-medium mb-2">Status</p>
                <Select 
                  defaultValue={selectedFeedback.Status || ''} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inbox">Inbox</SelectItem>
                    <SelectItem value="Analyse">Analyse</SelectItem>
                    <SelectItem value="Abgeschlossen">Abgeschlossen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <SheetFooter className="mt-6">
                <Button className="w-full">Save Changes</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FeedbackTable;
