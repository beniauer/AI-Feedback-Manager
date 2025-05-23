
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackItem } from '@/types/feedback';
import { useEffect } from 'react';

export function useFeedbackData() {
  const queryClient = useQueryClient();
  
  // Set up real-time subscription with improved error handling
  useEffect(() => {
    console.log('Setting up real-time subscription to feedback table');
    
    const channel = supabase
      .channel('feedback-updates')
      .on(
        'postgres_changes',
        {
          event: '*',  // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'SFS Jun PM Feedback'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Immediately invalidate the feedback query to refresh data
          queryClient.invalidateQueries({ queryKey: ['feedback'] });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
      
    console.log('Real-time channel subscription initialized');
      
    return () => {
      console.log('Unsubscribing from real-time channel');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['feedback'],
    queryFn: async (): Promise<FeedbackItem[]> => {
      console.log('Fetching feedback data');
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
        Creation_Date: new Date().toISOString() // Default to current date since Creation_Date doesn't exist in DB
      })) || [];

      console.log('Fetched feedback data:', mappedData);
      
      // Sort by UUID_Number (descending) to show the newest items first
      return mappedData.sort((a, b) => b.UUID_Number - a.UUID_Number);
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Always treat data as stale to ensure fresh data
    refetchInterval: 10000, // Refetch every 10 seconds as a fallback
  });
}

export function useUnreadCount() {
  const { data } = useFeedbackData();
  // Count items that are not solved (unread means not solved in this context)
  return data?.filter(item => item.Solved !== true).length || 0;
}

export function useSolvedCount() {
  const { data } = useFeedbackData();
  return data?.filter(item => item.Solved === true).length || 0;
}

export function useRepliedCount() {
  const { data } = useFeedbackData();
  return data?.filter(item => item.Replied === true).length || 0;
}
