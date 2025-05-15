
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackItem } from '@/types/feedback';

export function useFeedbackData() {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async (): Promise<FeedbackItem[]> => {
      const { data, error } = await supabase
        .from('SFS Jun PM Overview')
        .select('*');
      
      if (error) {
        console.error('Error fetching feedback data:', error);
        throw new Error('Failed to fetch feedback data');
      }
      
      return data || [];
    }
  });
}
