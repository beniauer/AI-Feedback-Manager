
import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { FeedbackItem } from '@/types/feedback';
import FeedbackDetail from '@/components/feedback/FeedbackDetail';
import FeedbackEntryItem from '@/components/feedback/FeedbackEntryItem';
import FeedbackFilter from '@/components/feedback/FeedbackFilter';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportFeedbackAsCSV } from '@/utils/feedbackUtils';
import { LoadingState, ErrorState, EmptyState } from '@/components/feedback/FeedbackStates';
import { useFilterContext } from '@/context/FilterContext';
import FeedbackTypesByProductChart from '@/components/charts/FeedbackTypesByProductChart';

const FeedbackInbox = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);
  
  const { filters } = useFilterContext();
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
    exportFeedbackAsCSV(filteredFeedback);
  };

  // Get unique products for product filter in pie chart
  const uniqueProducts = React.useMemo(() => {
    if (!feedbackData) return [];
    const products = new Set<string>();
    
    feedbackData.forEach(item => {
      if (item.Product_Name) {
        products.add(item.Product_Name);
      }
    });
    
    return Array.from(products);
  }, [feedbackData]);

  const filteredFeedback = React.useMemo(() => {
    if (!feedbackData) return [];
    
    let filtered = [...feedbackData];
    
    // Apply product filtering
    if (filters.products.length > 0) {
      filtered = filtered.filter(item => 
        filters.products.includes(item.Product_Name || '')
      );
    }
    
    // Apply type filtering
    if (filters.types.length > 0) {
      filtered = filtered.filter(item => 
        filters.types.includes(item.Type || '')
      );
    }
    
    // Apply date filtering
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(item => {
        const itemDate = item.Creation_Date ? new Date(item.Creation_Date) : null;
        if (!itemDate) return true;
        
        if (filters.dateRange.from && filters.dateRange.to) {
          return itemDate >= filters.dateRange.from && itemDate <= filters.dateRange.to;
        } else if (filters.dateRange.from) {
          return itemDate >= filters.dateRange.from;
        } else if (filters.dateRange.to) {
          return itemDate <= filters.dateRange.to;
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
  }, [feedbackData, filters]);

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
            <FeedbackFilter />
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Feedback Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                All Feedback
              </TabsTrigger>
              {uniqueProducts.map(product => (
                <TabsTrigger 
                  key={product} 
                  value={product} 
                  onClick={() => setSelectedProduct(product)}
                  className="flex items-center gap-1"
                >
                  {product}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="overview" className="h-80">
              <FeedbackTypesByProductChart />
            </TabsContent>
            {uniqueProducts.map(product => (
              <TabsContent key={product} value={product} className="h-80">
                <FeedbackTypesByProductChart productName={product} />
              </TabsContent>
            ))}
          </Tabs>
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
