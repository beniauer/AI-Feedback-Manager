
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
  products: ['Web App', 'Mobile App', 'Desktop App', 'API'],
  markets: ['EMEA', 'NA', 'APAC', 'LATAM'],
  priorities: ['Low', 'Medium', 'High'],
  types: ['Problem', 'Feature Request', 'Price', 'Competition'],
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
        "absolute top-0 left-0 h-[calc(100vh-4rem)] bg-background border-r w-72 transition-all duration-300 z-20",
        isOpen ? "translate-x-0" : "-translate-x-72"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 filter-panel">
            {/* Product Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Products</label>
              <div className="space-y-2">
                {mockOptions.products.map(product => (
                  <div key={product} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`product-${product}`}
                      className="mr-2"
                      checked={filters.products.includes(product)}
                      onChange={() => handleMultiSelectChange('products', product, filters.products)}
                    />
                    <label htmlFor={`product-${product}`} className="text-sm">{product}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Markets</label>
              <div className="space-y-2">
                {mockOptions.markets.map(market => (
                  <div key={market} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`market-${market}`}
                      className="mr-2"
                      checked={filters.markets.includes(market)}
                      onChange={() => handleMultiSelectChange('markets', market, filters.markets)}
                    />
                    <label htmlFor={`market-${market}`} className="text-sm">{market}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Priority</label>
              <div className="space-y-2">
                {mockOptions.priorities.map(priority => (
                  <div key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`priority-${priority}`}
                      className="mr-2"
                      checked={filters.priorities.includes(priority)}
                      onChange={() => handleMultiSelectChange('priorities', priority, filters.priorities)}
                    />
                    <label htmlFor={`priority-${priority}`} className="text-sm">{priority}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="space-y-2">
                {mockOptions.types.map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      className="mr-2"
                      checked={filters.types.includes(type)}
                      onChange={() => handleMultiSelectChange('types', type, filters.types)}
                    />
                    <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="space-y-2">
                {mockOptions.statuses.map(status => (
                  <div key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      className="mr-2"
                      checked={filters.statuses.includes(status)}
                      onChange={() => handleMultiSelectChange('statuses', status, filters.statuses)}
                    />
                    <label htmlFor={`status-${status}`} className="text-sm">{status}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleTagAdd()}
                />
                <Button onClick={handleTagAdd} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTagRemove(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                            {format(filters.dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(filters.dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: filters.dateRange.from,
                        to: filters.dateRange.to,
                      }}
                      onSelect={(range) => 
                        setFilters(prev => ({
                          ...prev,
                          dateRange: {
                            from: range?.from || prev.dateRange.from,
                            to: range?.to || prev.dateRange.to,
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
          </div>

          <div className="p-4 border-t">
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
      
      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute top-4 h-8 w-8 rounded-full bg-background shadow-md z-20",
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
