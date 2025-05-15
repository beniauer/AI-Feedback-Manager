
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUnreadCount, useSolvedCount, useRepliedCount } from '@/hooks/useFeedbackData';
import { Inbox, CheckCircle, MessageCircle, AlertCircle } from 'lucide-react';

const InboxOverview = () => {
  const unreadCount = useUnreadCount();
  const solvedCount = useSolvedCount();
  const repliedCount = useRepliedCount();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Inbox className="w-6 h-6 text-[#ff0105]" />
        <h2 className="text-2xl font-bold">Inbox: You have {unreadCount} unread feedbacks</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-[#ff0105] bg-white">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertCircle className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold">{unreadCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-[#ff0105] bg-white">
          <CardContent className="flex items-center gap-4 p-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Solved</p>
              <p className="text-2xl font-bold">{solvedCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-[#ff0105] bg-white">
          <CardContent className="flex items-center gap-4 p-6">
            <MessageCircle className="w-10 h-10 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Replied</p>
              <p className="text-2xl font-bold">{repliedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InboxOverview;
