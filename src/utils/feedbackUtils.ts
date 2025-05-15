
import { FeedbackItem, FeedbackStatus } from '@/types/feedback';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'unread': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'replied': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'solved': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getTypeColor = (type?: string) => {
  switch (type?.toLowerCase()) {
    case 'bug': return 'bg-red-100 text-red-800 border-red-200';
    case 'feature request': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'ux issue': return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'performance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'documentation': return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'question': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'feedback': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    
    toast({
      title: "Status Updated",
      description: `Feedback status changed to ${status}`,
    });
    return true;
  } catch (error) {
    console.error('Error updating status:', error);
    toast({
      title: "Update Failed",
      description: "Failed to update feedback status",
      variant: "destructive",
    });
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
    
    toast({
      title: "Marked as Replied",
      description: "Feedback has been marked as replied",
    });
    return true;
  } catch (error) {
    console.error('Error updating replied status:', error);
    toast({
      title: "Update Failed",
      description: "Failed to mark feedback as replied",
      variant: "destructive",
    });
    return false;
  }
};

export const markFeedbackAsSolved = async (id: number) => {
  try {
    const { error } = await supabase
      .from('SFS Jun PM Feedback')
      .update({ Solved: true, Status: 'Solved' })
      .eq('UUID_Number', id);
    
    if (error) throw error;
    
    toast({
      title: "Marked as Solved",
      description: "Feedback has been marked as solved",
    });
    return true;
  } catch (error) {
    console.error('Error updating solved status:', error);
    toast({
      title: "Update Failed",
      description: "Failed to mark feedback as solved",
      variant: "destructive",
    });
    return false;
  }
};

export const exportFeedbackAsCSV = (feedbackData: FeedbackItem[] | undefined) => {
  if (!feedbackData || feedbackData.length === 0) {
    toast({
      title: "Export Error",
      description: "No data available to export",
      variant: "destructive",
    });
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
    
    toast({
      title: "Export Successful",
      description: "Your data has been exported as CSV",
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast({
      title: "Export Error",
      description: "Failed to export data",
      variant: "destructive",
    });
  }
};
