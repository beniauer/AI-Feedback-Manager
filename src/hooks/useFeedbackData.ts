
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackItem } from '@/types/feedback';

export function useFeedbackData() {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async (): Promise<FeedbackItem[]> => {
      const { data, error } = await supabase
        .from('SFS Jun PM Feedback')
        .select('*');
      
      if (error) {
        console.error('Error fetching feedback data:', error);
        throw new Error('Failed to fetch feedback data');
      }
      
      return data || [];
    }
  });
}

export function useUnreadCount() {
  const { data } = useFeedbackData();
  return data?.filter(item => item.Status === 'Unread').length || 0;
}

export function useSolvedCount() {
  const { data } = useFeedbackData();
  return data?.filter(item => item.Solved === true).length || 0;
}

export function useRepliedCount() {
  const { data } = useFeedbackData();
  return data?.filter(item => item.Replied === true).length || 0;
}
