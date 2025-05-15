
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackItem } from '@/types/feedback';
import { useEffect } from 'react';

export function useFeedbackData() {
  const queryClient = useQueryClient();
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',  // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'SFS Jun PM Feedback'
        },
        () => {
          console.log('Real-time update received, invalidating query cache');
          queryClient.invalidateQueries({ queryKey: ['feedback'] });
        }
      )
      .subscribe();
      
    console.log('Real-time channel subscription initialized');
      
    return () => {
      console.log('Unsubscribing from real-time channel');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
      
      // Map the database column names to our frontend model
      const mappedData = data?.map(item => ({
        UUID_Number: item['UUID_Number'],
        Feedback_Title: item['Feedback Title'],
        Product_Name: item['Product Name'],
        Sales_Sender: item['Sales_Sender'] || null,
        Market: item['Market'] || null,
        Summary: item['Summary'],
        Type: item['Type'],
        Full_Message: item['Full Message'],
        Tags: item['Tags'],
        Status: item['Status'] || 'Unread',
        Replied: item['Replied'] || false,
        Solved: item['Solved'] || false,
        Creation_Date: item['Creation_Date'] || new Date().toISOString()
      })) || [];

      console.log('Fetched feedback data:', mappedData);
      return mappedData;
    },
    refetchOnWindowFocus: false
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
