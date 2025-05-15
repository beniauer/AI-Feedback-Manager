
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export interface FilterState {
  products: string[];
  types: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearFilters: () => void;
  setProductFilter: (products: string[]) => void;
  setTypeFilter: (types: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  areFiltersActive: boolean;
}

const defaultFilters: FilterState = {
  products: [],
  types: [],
  dateRange: {
    from: null,
    to: null,
  },
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

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const setProductFilter = useCallback((products: string[]) => {
    setFilters(prev => ({
      ...prev,
      products
    }));
  }, []);

  const setTypeFilter = useCallback((types: string[]) => {
    setFilters(prev => ({
      ...prev,
      types
    }));
  }, []);

  const setDateRangeFilter = useCallback((from: Date | null, to: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { from, to }
    }));
  }, []);

  // Compute whether any filters are active
  const areFiltersActive = 
    filters.products.length > 0 || 
    filters.types.length > 0 || 
    !!filters.dateRange.from || 
    !!filters.dateRange.to;

  return (
    <FilterContext.Provider 
      value={{ 
        filters, 
        setFilters, 
        clearFilters, 
        setProductFilter, 
        setTypeFilter, 
        setDateRangeFilter,
        areFiltersActive
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
