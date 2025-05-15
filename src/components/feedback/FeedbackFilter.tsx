
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FilterIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FeedbackFilterProps {
  onFilterChange: (dateRange: { from: Date | null, to: Date | null }) => void;
}

const FeedbackFilter = ({ onFilterChange }: FeedbackFilterProps) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFromDateChange = (date: Date | null) => {
    setFromDate(date);
    onFilterChange({ from: date, to: toDate });
  };

  const handleToDateChange = (date: Date | null) => {
    setToDate(date);
    onFilterChange({ from: fromDate, to: date });
  };

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
    onFilterChange({ from: null, to: null });
  };

  const isFiltersActive = fromDate || toDate;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={isFiltersActive ? "default" : "outline"} 
          size="sm" 
          className={cn("h-8", isFiltersActive ? "bg-primary text-white" : "")}
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          {isFiltersActive ? "Filters Active" : "Filter"}
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
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate || undefined}
                      onSelect={handleFromDateChange}
                      initialFocus
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
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate || undefined}
                      onSelect={handleToDateChange}
                      initialFocus
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
