import { useState, useCallback, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { ChatContext, type ChatContextType } from './chat-context';
import type { Mentor } from '../types/chat';

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentMentor, setCurrentMentor] = useState<Mentor | null>(null);
  const [conversations, setConversations] = useState<Mentor[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadConversations = useCallback(async () => {
    try {
      const mentors = await chatService.getConversations();
      
      const conversationList: Mentor[] = mentors.map((mentor) => ({
        id: mentor._id || mentor.id,
        name: mentor.name || `${mentor.firstName} ${mentor.lastName}`,
        title: mentor.title || 'Mentor',
        company: mentor.company,
        avatar: mentor.avatar,
        isAvailable: mentor.isAvailable !== false,
        lastMessage: 'Start a conversation...',
        lastMessageTime: new Date().toLocaleDateString(),
        unreadCount: 0
      }));
      
      setConversations(conversationList);
      
      const totalUnread = conversationList.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, []);

  const refreshConversations = useCallback(() => {
    loadConversations();
  }, [loadConversations]);

  const openChat = useCallback((mentor: Mentor) => {
    setCurrentMentor(mentor);
    setIsChatOpen(true);
    
    setConversations(prev => prev.map(conv => 
      conv.id === mentor.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
    
    setUnreadCount(prev => prev - (mentor.unreadCount || 0));
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setCurrentMentor(null);
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const value: ChatContextType = {
    isChatOpen,
    currentMentor,
    conversations,
    unreadCount,
    openChat,
    closeChat,
    loadConversations,
    refreshConversations
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;