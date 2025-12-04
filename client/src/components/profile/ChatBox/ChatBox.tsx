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

  useEffect(() => {
    if (!currentMentor) setMessages([]);
  }, [currentMentor]);

  const loadChatHistory = async (mentorId: string, userId: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/messages/${mentorId}/${userId}`);
      const data = await response.json();
      if (data.success) setMessages(data.messages);
    } catch { /* empty */ }
  };

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

    if (messages.length === 0) {
        loadChatHistory(currentMentor.id, user._id);
    }
    
    socket.emit('join_chat', { mentorId: currentMentor.id, userId: user._id });

    const handleReceiveMessage = (data: SocketMessage) => {
      setMessages(prev => {
        if (prev.some(msg => msg.id === data.id)) return prev;
        return [...prev, data];
      });
      window.dispatchEvent(new CustomEvent('newMessage'));
    };

    socket.on('receive_message', handleReceiveMessage);
    
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, currentMentor, user, messages.length]); 

  const handleSendMessage = () => {
    if (!message.trim() || !currentMentor || !user || !socket || !isConnected) return;
    
    socket.emit('send_message', {
      mentorId: currentMentor.id,
      userId: user._id,
      message: message,
      type: 'text',
      timestamp: new Date().toISOString(),
    });

    setMessage('');
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

      <div className={`fixed inset-0 md:inset-auto md:bottom-0 md:right-6 w-full md:w-[380px] h-full md:h-[500px] md:max-h-[80vh] bg-white flex flex-col z-50 md:rounded-xl md:shadow-2xl md:border md:border-gray-200 overflow-hidden transition-all duration-300 ${isChatOpen ? 'translate-y-0 opacity-100 flex' : 'translate-y-8 opacity-0 pointer-events-none hidden'}`}>
        
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={closeChat} className="md:hidden text-gray-600 hover:text-gray-900 transition">
              <FaChevronLeft size={18} />
            </button>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-semibold text-sm overflow-hidden">
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
                className="font-semibold text-gray-900 text-sm hover:underline hover:text-blue-600 transition-colors"
              >
                {currentMentor.name}
              </Link>

              <span className="text-xs text-gray-500">
                {currentMentor.title || (currentMentor.role === 'student' ? 'Student' : 'Mentor')}
              </span>

            </div>
          </div>
          <button onClick={closeChat} className="hidden md:block text-gray-500 hover:text-gray-900 transition p-1.5 hover:bg-gray-100 rounded-full">
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50" ref={messagesEndRef} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <FaPaperPlane className="text-gray-400 text-2xl" />
              </div>
              <p className="text-sm">Send a message to start chatting</p>
            </div>
          ) : (
            messages.map(msg => {
              const isCurrentUser = msg.socketId === socket?.id || msg.userId === user?._id;
              return (
                <div key={msg.id} className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    
                    {msg.type === 'booking' && msg.booking ? (
                      <BookingCard 
                        booking={msg.booking} 
                        isSender={isCurrentUser}
                        onAccept={() => onAcceptClick(msg.id)}
                        onDecline={() => handleDeclineBooking(msg.id)}
                        onComplete={() => handleCompleteBooking(msg.id)}
                      />
                    ) : (
                      <div className={`px-3 py-2 text-[13px] leading-relaxed wrap-break-word ${
                        isCurrentUser 
                          ? 'bg-[#0084ff] text-white rounded-[18px]' 
                          : 'bg-gray-200 text-gray-900 rounded-[18px]'
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    <span className="text-[10px] text-gray-400 mt-1 px-2">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-3 py-2.5 bg-white border-t border-gray-200">
          <div className="flex items-center gap-1.5">
            
            {user?.role === 'student' && (
              <button 
                onClick={() => setIsSessionModalOpen(true)}
                className="w-8 h-8 rounded-full text-[#0084ff] hover:bg-gray-100 transition flex items-center justify-center shrink-0"
                title="Schedule Session"
              >
                <FaCalendarPlus size={16} />
              </button>
            )}

            <div className="flex-1 flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Aa"
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-900 placeholder-gray-500"
                disabled={!isConnected}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition shrink-0 ${
                message.trim() && isConnected
                  ? 'bg-[#0084ff] text-white hover:bg-[#0073e6]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaPaperPlane size={13} />
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