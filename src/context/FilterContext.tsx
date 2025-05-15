
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface FilterState {
  products: string[];
  markets: string[];
  priorities: string[];
  types: string[];
  statuses: string[];
  tags: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearFilters: () => void;
}

const getDefaultDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 90); // Default to last 90 days
  return { from, to };
};

const defaultFilters: FilterState = {
  products: [],
  markets: [],
  priorities: [],
  types: [],
  statuses: [],
  tags: [],
  dateRange: getDefaultDateRange(),
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
