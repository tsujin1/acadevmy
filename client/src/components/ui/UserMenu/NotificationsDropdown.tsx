import { PiBell, PiStarFill, PiInfo, PiCalendar } from 'react-icons/pi';
import type { Notification } from './types';

interface NotificationsDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAllRead: () => void;
  onRefresh: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationsDropdown = ({
  notifications,
  isLoading,
  onMarkAllRead,
  onRefresh,
  onNotificationClick,
}: NotificationsDropdownProps) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'review': return <PiStarFill className="w-4 h-4" />;
      case 'booking': return <PiCalendar className="w-4 h-4" />;
      default: return <PiInfo className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'review': return 'bg-yellow-100 text-yellow-600';
      case 'booking': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiBell className="h-5 w-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-6 text-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button 
                onClick={onMarkAllRead}
                className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                Mark read
              </button>
            )}
            <button 
              onClick={onRefresh}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="px-4 py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading updates...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => onNotificationClick(notif)}
              className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left ${
                !notif.isRead ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(notif.type)}`}>
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'} truncate`}>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {formatDate(notif.createdAt)}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <PiBell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">
              We'll notify you about reviews and updates here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;