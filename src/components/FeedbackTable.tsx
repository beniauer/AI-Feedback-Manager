
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
import { ArrowUp, ArrowDown, Download } from 'lucide-react';

// Mock data
const generateMockFeedback = (count: number) => {
  const markets = ['EMEA', 'NA', 'APAC', 'LATAM'];
  const priorities = ['Low', 'Medium', 'High'];
  const types = ['Problem', 'Feature Request', 'Price', 'Competition'];
  const statuses = ['Inbox', 'Analyse', 'Abgeschlossen'];
  const products = ['Web App', 'Mobile App', 'Desktop App', 'API'];
  const tags = ['UX', 'Performance', 'Security', 'Pricing', 'Feature', 'Bug'];
  
  const senders = [
    'customer@example.com',
    'user@company.co',
    'client@business.org',
    'member@startup.io',
    'contact@enterprise.com'
  ];

  const summaries = [
    'App crashes when loading large datasets',
    'Need feature for exporting reports as PDF',
    'Performance issues on mobile devices',
    'Login page takes too long to load',
    'Competitors offer better pricing options',
    'Dashboard doesn\'t show all relevant metrics',
    'Security concerns with data storage',
    'User interface is confusing for new users',
    'Search functionality doesn\'t work properly',
    'Need better integration with third-party tools'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `fee-${i + 1}`,
    product: products[Math.floor(Math.random() * products.length)],
    market: markets[Math.floor(Math.random() * markets.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      tags[Math.floor(Math.random() * tags.length)]
    ),
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    full_message: `This is a detailed message for feedback ${i + 1}. It contains more information about the issue or request that was submitted by the user.`,
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    sender: senders[Math.floor(Math.random() * senders.length)]
  }));
};

const mockFeedbackData = generateMockFeedback(50);

const FeedbackTable = () => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...mockFeedbackData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleRowClick = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsSheetOpen(true);
  };

  const handleStatusChange = (value: string) => {
    if (selectedFeedback) {
      console.log(`Changing status of feedback ${selectedFeedback.id} to ${value}`);
      // In a real app, we would update the status in the database
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Inbox': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Analyse': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'Abgeschlossen': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Feedback Details</CardTitle>
          <Button variant="outline" size="sm" className="h-8">
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
                    onClick={() => handleSort('summary')}
                  >
                    Summary
                    {sortField === 'summary' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('market')}
                  >
                    Market
                    {sortField === 'market' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('priority')}
                  >
                    Priority
                    {sortField === 'priority' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('sender')}
                  >
                    Sender
                    {sortField === 'sender' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                        <ArrowDown className="h-4 w-4 inline ml-1" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    Date
                    {sortField === 'created_at' && (
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
                    key={feedback.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(feedback)}
                  >
                    <TableCell className="font-medium">{feedback.summary}</TableCell>
                    <TableCell>{feedback.market}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getPriorityColor(feedback.priority)}`}>
                        {feedback.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{feedback.sender}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(feedback.created_at)}
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
                <SheetTitle>{selectedFeedback.summary}</SheetTitle>
                <SheetDescription>
                  From {selectedFeedback.sender} on {formatDate(selectedFeedback.created_at)}
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Product</p>
                    <p className="text-sm">{selectedFeedback.product}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Market</p>
                    <p className="text-sm">{selectedFeedback.market}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Type</p>
                    <p className="text-sm">{selectedFeedback.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Priority</p>
                    <Badge variant="outline" className={`${getPriorityColor(selectedFeedback.priority)}`}>
                      {selectedFeedback.priority}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedFeedback.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Message</p>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-line">{selectedFeedback.full_message}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Status</p>
                <Select 
                  defaultValue={selectedFeedback.status} 
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
