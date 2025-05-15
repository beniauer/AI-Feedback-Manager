
import React from 'react';
import { useUnreadCount } from '@/hooks/useFeedbackData';
import { Bell } from 'lucide-react';

const Header = () => {
  const unreadCount = useUnreadCount();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/f96780ab-6e25-4ff0-9cb0-3a12cdb8b563.png" alt="Screw Crew" className="h-10" />
          <h1 className="text-xl font-semibold text-gray-800">Feedback Manager</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 p-1 text-xs font-bold text-white rounded-full bg-[#ff0105] -translate-y-1/2 translate-x-1/2">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
