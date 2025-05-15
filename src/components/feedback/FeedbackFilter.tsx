
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FilterIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFilterContext } from '@/context/FilterContext';

const FeedbackFilter = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { 
    filters, 
    setDateRangeFilter, 
    clearFilters,
    areFiltersActive
  } = useFilterContext();

  const handleFromDateChange = (date: Date | null) => {
    setDateRangeFilter(date, filters.dateRange.to);
  };

  const handleToDateChange = (date: Date | null) => {
    setDateRangeFilter(filters.dateRange.from, date);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={areFiltersActive ? "default" : "outline"} 
          size="sm" 
          className={cn("h-8", areFiltersActive ? "bg-primary text-white" : "")}
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          {areFiltersActive ? "Filters Active" : "Filter"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Date Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">From</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !filters.dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? format(filters.dateRange.from, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from || undefined}
                      onSelect={handleFromDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">To</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !filters.dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? format(filters.dateRange.to, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to || undefined}
                      onSelect={handleToDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" onClick={() => setIsOpen(false)}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FeedbackFilter;
