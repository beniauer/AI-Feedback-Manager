
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFilterContext, FilterState } from '@/context/FilterContext';
import { useIsMobile } from '@/hooks/use-mobile';

const mockOptions = {
  products: ['PowerFast XL-5', 'DrillMaster Pro', 'DigiLevel 2000', 'UltraAnchor Max', 'SpeedRivet 500'],
  markets: ['ConstructCorp', 'BuildRight Inc', 'PrecisionBuilders', 'Skyscraper Solutions', 'MetalWorks Manufacturing'],
  priorities: ['Low', 'Medium', 'High'],
  types: ['Bug', 'Feature Request', 'UX Issue', 'Performance', 'Documentation'],
  statuses: ['Inbox', 'Analyse', 'Abgeschlossen']
};

const Sidebar: React.FC = () => {
  const { filters, setFilters, clearFilters } = useFilterContext();
  const [isOpen, setIsOpen] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState(['UX', 'Performance', 'Security', 'Pricing', 'Feature', 'Bug']);
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const handleTagAdd = () => {
    if (tagInput && !filters.tags.includes(tagInput)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleMultiSelectChange = (
    key: keyof FilterState,
    value: string,
    currentValues: string[]
  ) => {
    const isSelected = currentValues.includes(value);
    let newValues;
    
    if (isSelected) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    setFilters(prev => ({
      ...prev,
      [key]: newValues
    }));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-full">
      <div className={cn(
        "absolute top-0 left-0 h-[calc(100vh-4rem)] bg-white border-r w-72 transition-all duration-300 z-20",
        isOpen ? "translate-x-0" : "-translate-x-72"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 filter-panel space-y-6">
            {/* Product Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <Select 
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  products: value === 'all' ? [] : [value]
                }))}
                value={filters.products.length === 0 ? 'all' : filters.products[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {mockOptions.products.map(product => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter (was Type) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Select 
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  types: value === 'all' ? [] : [value]
                }))}
                value={filters.types.length === 0 ? 'all' : filters.types[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockOptions.types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Customer Filter (was Market) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <Select 
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  markets: value === 'all' ? [] : [value]
                }))}
                value={filters.markets.length === 0 ? 'all' : filters.markets[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {mockOptions.markets.map(market => (
                    <SelectItem key={market} value={market}>
                      {market}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal bg-white border-gray-300 text-gray-800"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        format(filters.dateRange.from, "MMM dd, yyyy")
                      ) : (
                        <span>From</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) => 
                        setFilters(prev => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            from: date || prev.dateRange.from,
                          }
                        }))
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal bg-white border-gray-300 text-gray-800"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? (
                        format(filters.dateRange.to, "MMM dd, yyyy")
                      ) : (
                        <span>To</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) => 
                        setFilters(prev => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            to: date || prev.dateRange.to,
                          }
                        }))
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={clearFilters} 
                variant="outline" 
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute top-4 h-8 w-8 rounded-full bg-white shadow-md z-20",
          isOpen ? "left-72 -translate-x-1/2" : "left-0 translate-x-1/2"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default Sidebar;
