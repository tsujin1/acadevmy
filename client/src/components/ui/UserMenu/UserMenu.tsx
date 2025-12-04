import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiBell, PiEnvelope } from 'react-icons/pi';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import type { Mentor } from '@/types/chat';
import Avatar from './Avatar';
import IconButton from './IconButton';
import ConversationsDropdown from './ConversationsDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import UserDropdown from './UserDropdown';
import type { Conversation, ApiConversation, UserData, Notification } from './types';

const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openChat } = useChat();
  const menuRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token');

  const totalUnreadMessages = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  const totalUnreadNotifications = notifications.filter(n => !n.isRead).length;

  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      if (response.ok) {
        const userData: UserData = await response.json();
        
        let avatarUrl: string | undefined;
        if (userData.avatar) {
          if (typeof userData.avatar === 'string') {
            avatarUrl = userData.avatar;
          } else if (userData.avatar.url) {
            avatarUrl = userData.avatar.url;
            if (avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('data:')) {
              avatarUrl = `${API_BASE_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
            }
          }
        }

        const userRole = userData.role 
          ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) 
          : 'User';

        return {
          name: `${userData.firstName} ${userData.lastName}`,
          title: userData.title || userRole, 
          role: userData.role,
          avatar: avatarUrl
        };
      }
    } catch (error) {
      console.error(error);
    }
    return { name: `User ${userId.substring(0, 6)}`, title: 'User' };
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  const markNotificationAsRead = async (id: string) => {
    const token = getToken();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, { 
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const markAllNotificationsRead = async () => {
    const token = getToken();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    if (!user) return;
    try {
      await fetch(`${API_BASE_URL}/api/notifications/read-all/${user._id}`, { 
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) await markNotificationAsRead(notification.id);
    setShowNotifications(false);
    setIsOpen(false);
    if (notification.relatedId) {
      navigate(`/profile?tab=reviews&highlightReview=${notification.relatedId}`);
    }
  };

  const markConversationAsRead = useCallback(async (roomId: string) => {
    if (!user) return false;
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ roomId, userId: user._id })
      });
      if (response.ok) {
        setConversations(prev => prev.map(conv => conv.id === roomId ? { ...conv, unreadCount: 0 } : conv));
        return true;
      }
    } catch (error) { console.error(error); }
    return false;
  }, [user]);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/conversations/${user._id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        const transformedConversations: Conversation[] = await Promise.all(
          (data.conversations || []).map(async (conv: ApiConversation) => {
            const roomParts = conv.roomId.split('_');
            const mentorId = roomParts[1] === user._id ? roomParts[2] : roomParts[1];
            const userDetails = await fetchUserDetails(mentorId);
            const lastMessageText = conv.lastMessage?.text || 'No messages yet';
            return {
              id: conv.roomId,
              mentorId,
              name: userDetails.name,
              title: userDetails.title,
              avatar: userDetails.avatar,
              lastMessage: lastMessageText,
              unreadCount: conv.unreadCount || 0,
              hasMessages: !!conv.lastMessage
            };
          })
        );
        setConversations(transformedConversations);
      }
    } catch (error) {
      console.error(error);
      setFetchError(error instanceof Error ? error.message : 'Unknown error');
      setConversations([]);
    } finally { setIsLoading(false); }
  }, [user, fetchUserDetails]);

  const handleConversationClick = async (conversation: Conversation) => {
    if (conversation.unreadCount > 0) await markConversationAsRead(conversation.id);
    const mentor: Mentor = {
      id: conversation.mentorId,
      name: conversation.name,
      role: conversation.role,
      title: conversation.title,
      avatar: conversation.avatar,
      isAvailable: true,
      lastMessage: conversation.lastMessage,
      unreadCount: 0,
    };
    openChat(mentor);
    setShowConversations(false);
  };

  useEffect(() => {
    if (!user) return;
    const socket = io(API_BASE_URL, { auth: { token: getToken() } });
    socketRef.current = socket;
    
    socket.emit('register_user', { userId: user._id, userType: user.role || 'user' });
    
    socket.on('newNotification', (notification: Notification) => {
      setNotifications(prev => prev.some(n => n.id === notification.id) ? prev : [notification, ...prev]);
    });
    socket.on('receive_message', () => {
      fetchConversations();
    });
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [user, fetchConversations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowConversations(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); setIsOpen(false); setShowConversations(false); setShowNotifications(false); };
  const handleMessageClick = () => { setShowConversations(!showConversations); setShowNotifications(false); setIsOpen(false); };
  const handleNotificationClickBtn = () => { setShowNotifications(!showNotifications); setShowConversations(false); setIsOpen(false); };
  const handleProfileClick = () => { setIsOpen(false); setShowConversations(false); setShowNotifications(false); };

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-3">
        <IconButton icon={PiEnvelope} badgeCount={totalUnreadMessages} onClick={handleMessageClick} isActive={showConversations} />
        <IconButton icon={PiBell} badgeCount={totalUnreadNotifications} onClick={handleNotificationClickBtn} isActive={showNotifications} />
        <button onClick={() => { setIsOpen(!isOpen); setShowConversations(false); setShowNotifications(false); }} className="hover:opacity-90 transition-opacity">
          <Avatar showChevron name={`${user?.firstName} ${user?.lastName}`} avatarUrl={user?.avatar?.url} />
        </button>
      </div>

      {showConversations && (
        <ConversationsDropdown conversations={conversations} totalUnreadMessages={totalUnreadMessages} isLoading={isLoading} fetchError={fetchError} onRefresh={fetchConversations} onConversationClick={handleConversationClick} />
      )}

      {showNotifications && (
        <NotificationsDropdown notifications={notifications} isLoading={isLoading} onMarkAllRead={markAllNotificationsRead} onRefresh={fetchNotifications} onNotificationClick={handleNotificationClick} />
      )}

      {isOpen && !showConversations && !showNotifications && user && (
        <UserDropdown user={user} onProfileClick={handleProfileClick} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default UserMenu;