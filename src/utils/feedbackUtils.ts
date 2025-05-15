
import { FeedbackItem, FeedbackStatus } from '@/types/feedback';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'unread': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'replied': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'solved': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function getTypeColor(type: string | undefined): string {
  switch ((type || '').toLowerCase()) {
    case 'complaint':
      return 'bg-[#6050DC] text-white';
    case 'suggestion':
      return 'bg-[#D52DB7] text-white';
    case 'problem':
    case 'praise':  // Keeping praise compatible with previous code
      return 'bg-[#FF2E7E] text-white';
    case 'feature request':
    case 'question': // Keeping question compatible with previous code
      return 'bg-[#FF6B45] text-white';
    case 'price':
      return 'bg-[#FFAB05] text-white';
    case 'competition':
    case 'competitor': // Keeping competitor compatible with previous code
      return 'bg-[#FFF79C] text-black'; // Using black text for better contrast on light background
    // Keeping other mappings for backward compatibility
    case 'bug':
      return 'bg-[#6050DC] text-white';
    case 'ux issue':
      return 'bg-[#FF2E7E] text-white';
    case 'performance':
      return 'bg-[#FF6B45] text-white';
    case 'documentation':
      return 'bg-[#FFAB05] text-white';
    case 'issue':
      return 'bg-[#6050DC] text-white';
    case 'feedback':
      return 'bg-[#FF2E7E] text-white';
    case 'improvement':
      return 'bg-[#D52DB7] text-white';
    case 'critical':
      return 'bg-[#FF2E7E] text-white';
    case 'enhancement':
      return 'bg-[#D52DB7] text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

export const updateFeedbackStatus = async (id: number, status: string) => {
  try {
    const { error } = await supabase
      .from('SFS Jun PM Feedback')
      .update({ Status: status })
      .eq('UUID_Number', id);
    
    if (error) throw error;
    
    toast.success(`Feedback status changed to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating status:', error);
    toast.error("Failed to update feedback status");
    return false;
  }
};

export const markFeedbackAsReplied = async (id: number) => {
  try {
    const { error } = await supabase
      .from('SFS Jun PM Feedback')
      .update({ Replied: true, Status: 'Replied' })
      .eq('UUID_Number', id);
    
    if (error) throw error;
    
    toast.success("Feedback has been marked as replied");
    return true;
  } catch (error) {
    console.error('Error updating replied status:', error);
    toast.error("Failed to mark feedback as replied");
    return false;
  }
};

// Improved function with detailed logging and better error handling
export const toggleFeedbackSolvedStatus = async (id: number, currentStatus: boolean) => {
  // Show immediate loading toast for better UX
  const toastId = toast.loading(currentStatus ? 'Removing solved status...' : 'Marking as solved...');
  
  try {
    console.log(`Toggling feedback #${id} solved status from ${currentStatus} to ${!currentStatus}`);
    
    // Define the new state (opposite of current)
    const newSolvedState = !currentStatus;
    
    // Log the exact update we're sending to Supabase
    console.log('Sending update to Supabase:', {
      table: 'SFS Jun PM Feedback',
      id: id,
      update: { 
        Solved: newSolvedState, 
        Status: newSolvedState ? 'Solved' : 'Read' 
      }
    });
    
    // Make the update to Supabase with explicit column names
    const { data, error } = await supabase
      .from('SFS Jun PM Feedback')
      .update({ 
        Solved: newSolvedState, 
        Status: newSolvedState ? 'Solved' : 'Read' 
      })
      .eq('UUID_Number', id);
    
    // Log the response from Supabase
    console.log('Supabase update response:', { data, error });
    
    // Check for errors
    if (error) {
      console.error('Supabase update error:', error);
      toast.error('Failed to update solved status', { id: toastId });
      return false;
    }
    
    // Dismiss loading toast and show success toast
    toast.success(
      newSolvedState ? 'Marked as solved!' : 'Removed solved status', 
      { id: toastId }
    );
    
    console.log(`Successfully updated feedback #${id} solved status to ${newSolvedState}`);
    return true;
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error in toggleFeedbackSolvedStatus:', error);
    toast.error('Something went wrong', { id: toastId });
    return false;
  }
};

export const exportFeedbackAsCSV = (feedbackData: FeedbackItem[] | undefined) => {
  if (!feedbackData || feedbackData.length === 0) {
    toast.error("No data available to export");
    return;
  }

  try {
    // Generate CSV content
    const headers = Object.keys(feedbackData[0]).join(',');
    const rows = feedbackData.map(item => 
      Object.values(item).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'feedback_export.csv';
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
    toast.success("Your data has been exported as CSV");
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast.error("Failed to export data");
  }
};
