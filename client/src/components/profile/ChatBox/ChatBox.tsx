import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaPaperPlane, FaChevronLeft, FaCalendarPlus } from 'react-icons/fa';
import { useChat } from '@/hooks/useChat';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import BookingCard from './BookingCard';
import SessionModal from './SessionModal';
import AcceptSessionModal from './AcceptSessionModal';
import type { SocketMessage, Booking } from './types';

const ChatBox = () => {
  const { isChatOpen, currentMentor, closeChat } = useChat();
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [message, setMessage] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollTo({ top: messagesEndRef.current.scrollHeight, behavior: 'smooth' });
  
  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  const loadChatHistory = async (mentorId: string, userId: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages/${mentorId}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Clear messages and input when switching conversations
  // Clear messages and input when switching conversations
  useEffect(() => {
    if (!currentMentor) {
      setMessages([]);
      setMessage('');
      return;
    }

    // Clear messages and input when currentMentor changes
    setMessages([]);
    setMessage('');
    
    // Load chat history for the new conversation
    if (user) {
      loadChatHistory(currentMentor.id, user._id);
    }
  }, [currentMentor?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleBookingUpdate = (data: { messageId: string; booking: Booking }) => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === data.messageId && msg.booking) {
          return { ...msg, booking: data.booking };
        }
        return msg;
      }));
    };

    socket.on('booking_updated', handleBookingUpdate);
    return () => {
      socket.off('booking_updated', handleBookingUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !currentMentor || !user) return;
    
    socket.emit('join_chat', { mentorId: currentMentor.id, userId: user._id });

    const handleReceiveMessage = (data: SocketMessage) => {
      // Calculate the expected roomId for current conversation
      const ids = [currentMentor.id, user._id].sort();
      const expectedRoomId = `private_${ids[0]}_${ids[1]}`;
      
      setMessages(prev => {
        // Remove optimistic message if it exists (same text and sender)
        const filtered = prev.filter(msg => 
          !(msg.id.startsWith('temp_') && 
            msg.text === data.text && 
            msg.sender === data.sender &&
            msg.userId === data.userId)
        );
        
        // Check if message already exists
        if (filtered.some(msg => msg.id === data.id)) return filtered;
        
        // Only add message if it belongs to the current conversation
        if (data.roomId === expectedRoomId) {
          return [...filtered, data];
        }
        return filtered;
      });
      window.dispatchEvent(new CustomEvent('newMessage'));
    };

    socket.on('receive_message', handleReceiveMessage);
    
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, currentMentor?.id, user?._id]); 

  const handleSendMessage = () => {
    if (!message.trim() || !currentMentor || !user || !socket || !isConnected) return;
    
    const messageText = message.trim();
    const tempId = `temp_${Date.now()}`;
    const ids = [currentMentor.id, user._id].sort();
    const roomId = `private_${ids[0]}_${ids[1]}`;
    
    // Optimistically add message to UI
    const optimisticMessage: SocketMessage = {
      id: tempId,
      text: messageText,
      sender: user.role === 'mentor' ? 'mentor' : 'user',
      timestamp: new Date().toISOString(),
      userId: user._id,
      roomId: roomId,
      isRead: false,
      type: 'text'
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    
    // If user is a mentor, use mentor_reply, otherwise use send_message
    if (user.role === 'mentor') {
      socket.emit('mentor_reply', {
        mentorId: user._id,
        userId: currentMentor.id, // In this case, currentMentor is actually the student
        message: messageText,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
    } else {
      socket.emit('send_message', {
        mentorId: currentMentor.id,
        userId: user._id,
        message: messageText,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
    }

    window.dispatchEvent(new CustomEvent('newMessage'));
  };

  const handleSendProposal = (proposalData: { topic: string; date: string; time: string; duration: number }) => {
    if (!currentMentor || !user || !socket) return;

    const bookingData = {
      id: Date.now().toString(),
      ...proposalData,
      status: 'pending' as const,
    };

    socket.emit('send_message', {
      mentorId: currentMentor.id,
      userId: user._id,
      type: 'booking',
      text: 'New Session Request',
      booking: bookingData,
      timestamp: new Date().toISOString(),
    });
    
    setIsSessionModalOpen(false);
  };

  const onAcceptClick = (messageId: string) => {
    setSelectedBookingId(messageId);
    setIsAcceptModalOpen(true);
  };

  const handleConfirmAccept = (link: string) => {
    if (selectedBookingId && socket) {
      socket.emit('update_booking_status', {
        messageId: selectedBookingId,
        status: 'accepted',
        meetingLink: link
      });
    }
    setIsAcceptModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleDeclineBooking = (messageId: string) => {
    if (confirm("Are you sure you want to decline this session?") && socket) {
      socket.emit('update_booking_status', {
        messageId,
        status: 'declined'
      });
    }
  };

  const handleCompleteBooking = (messageId: string) => {
    if (confirm("Mark this session as finished?") && socket) {
      socket.emit('update_booking_status', {
        messageId,
        status: 'completed'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentMentor) return null;

  const hasAvatar = Boolean(currentMentor.avatar) && !avatarError;
  const initials = currentMentor.name.split(' ').map(n => n[0]).join('');

  const profilePath = currentMentor.role === 'student' 
  ? `/student/${currentMentor.id}` 
  : `/mentor/${currentMentor.id}`;

  return (
    <>
      {isChatOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={closeChat} />}

      <div className={`fixed inset-0 md:inset-auto md:bottom-0 md:right-6 w-full md:w-[400px] h-full md:h-[600px] md:max-h-[85vh] bg-white flex flex-col z-50 md:rounded-xl md:shadow-2xl md:border md:border-slate-200 overflow-hidden transition-all duration-300 ${isChatOpen ? 'translate-y-0 opacity-100 flex' : 'translate-y-8 opacity-0 pointer-events-none hidden'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button onClick={closeChat} className="md:hidden text-slate-600 hover:text-slate-900 transition-colors">
              <FaChevronLeft size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-sm overflow-hidden ring-2 ring-slate-200">
              {hasAvatar ? (
                <img 
                  src={currentMentor.avatar} 
                  alt={currentMentor.name}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col">
              <Link 
                to={profilePath}
                onClick={closeChat}
                className="font-semibold text-slate-900 text-sm hover:text-slate-700 transition-colors"
              >
                {currentMentor.name}
              </Link>
              <span className="text-xs text-slate-500">
                {currentMentor.title || (currentMentor.role === 'student' ? 'Student' : 'Mentor')}
              </span>
            </div>
          </div>
          <button onClick={closeChat} className="hidden md:block text-slate-500 hover:text-slate-900 transition-colors p-1.5 hover:bg-slate-100 rounded-full">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50" ref={messagesEndRef} style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                <FaPaperPlane className="text-slate-400 text-3xl" />
              </div>
              <p className="text-sm font-medium text-slate-500">Send a message to start chatting</p>
            </div>
          ) : (
            messages.map(msg => {
              const isCurrentUser = msg.socketId === socket?.id || msg.userId === user?._id;
              return (
                <div key={msg.id} className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    
                    {msg.type === 'booking' && msg.booking ? (
                      <BookingCard 
                        booking={msg.booking} 
                        isSender={isCurrentUser}
                        onAccept={() => onAcceptClick(msg.id)}
                        onDecline={() => handleDeclineBooking(msg.id)}
                        onComplete={() => handleCompleteBooking(msg.id)}
                      />
                    ) : (
                      <div className={`px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm ${
                        isCurrentUser 
                          ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm' 
                          : 'bg-white text-slate-900 rounded-2xl rounded-tl-sm border border-slate-200'
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    <span className="text-[11px] text-slate-400 mt-1.5 px-2">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 bg-white border-t border-slate-200">
          <div className="flex items-end gap-2">
            {user?.role === 'student' && (
              <button 
                onClick={() => setIsSessionModalOpen(true)}
                className="w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center shrink-0"
                title="Schedule Session"
              >
                <FaCalendarPlus size={18} />
              </button>
            )}

            <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2.5 border border-slate-200 focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition-all">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-500"
                disabled={!isConnected}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                message.trim() && isConnected
                  ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-sm' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>

        <SessionModal 
          isOpen={isSessionModalOpen} 
          onClose={() => setIsSessionModalOpen(false)} 
          onSubmit={handleSendProposal}
        />
        
        <AcceptSessionModal
          isOpen={isAcceptModalOpen}
          onClose={() => setIsAcceptModalOpen(false)}
          onConfirm={handleConfirmAccept}
        />
      </div>
    </>
  );
};

export default ChatBox;