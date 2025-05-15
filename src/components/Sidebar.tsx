
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { useFilterContext } from '@/context/FilterContext';
import { Badge } from './ui/badge';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { data: feedbackData } = useFeedbackData();
  const { 
    filters, 
    clearFilters, 
    setProductFilter, 
    setTypeFilter, 
    setDateRangeFilter,
    areFiltersActive
  } = useFilterContext();
  
  // Extract unique products and types
  const products = React.useMemo(() => {
    if (!feedbackData) return [];
    return [...new Set(feedbackData.map(item => item.Product_Name).filter(Boolean))] as string[];
  }, [feedbackData]);
  
  const types = React.useMemo(() => {
    if (!feedbackData) return [];
    return [...new Set(feedbackData.map(item => item.Type).filter(Boolean))] as string[];
  }, [feedbackData]);

  // Handle product selection
  const handleProductChange = (value: string) => {
    if (value === 'all') {
      setProductFilter([]);
    } else {
      setProductFilter([value]);
    }
  };

  // Handle type selection
  const handleTypeChange = (value: string) => {
    if (value === 'all') {
      setTypeFilter([]);
    } else {
      setTypeFilter([value]);
    }
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className={`h-5 w-5 ${isOpen || areFiltersActive ? 'text-[#ff0105]' : ''}`} />
        </Button>
      )}

      <aside
        className={`
          ${isMobile ? 'fixed inset-y-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative border-r'}
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
          w-64 bg-white border-gray-200
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            {areFiltersActive && (
              <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                Active
              </Badge>
            )}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select 
                value={filters.products[0] || 'all'} 
                onValueChange={handleProductChange}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product} value={product}>{product}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedbackType">Feedback Type</Label>
              <Select 
                value={filters.types[0] || 'all'} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="feedbackType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal text-xs"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? 
                        format(filters.dateRange.from, 'PPP') : 
                        <span>From</span>
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from || undefined}
                      onSelect={(date) => setDateRangeFilter(date, filters.dateRange.to)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal text-xs"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? 
                        format(filters.dateRange.to, 'PPP') : 
                        <span>To</span>
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to || undefined}
                      onSelect={(date) => setDateRangeFilter(filters.dateRange.from, date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="w-full"
              disabled={!areFiltersActive}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </aside>
      
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
