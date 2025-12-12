import { useState } from 'react';
import { PiChats } from 'react-icons/pi';
import { FaTrash } from 'react-icons/fa';
import Avatar from './Avatar';
import type { Conversation } from './types';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ConversationsDropdownProps {
  conversations: Conversation[];
  totalUnreadMessages: number;
  isLoading: boolean;
  fetchError: string | null;
  onRefresh: () => void;
  onConversationClick: (conversation: Conversation) => void;
  onDeleteConversation: (roomId: string) => void;
}

const ConversationsDropdown = ({
  conversations,
  totalUnreadMessages,
  isLoading,
  fetchError,
  onRefresh,
  onConversationClick,
  onDeleteConversation,
}: ConversationsDropdownProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    setConversationToDelete(conversation);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      onDeleteConversation(conversationToDelete.id);
      setConversationToDelete(null);
    }
  };
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <PiChats className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
          {totalUnreadMessages > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-6 text-center">
              {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
            </span>
          )}
          <button 
            onClick={onRefresh}
            className="ml-auto text-xs text-blue-600 hover:text-blue-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="px-4 py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading conversations...</p>
          </div>
        ) : fetchError ? (
          <div className="px-4 py-8 text-center">
            <PiChats className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-red-500">Failed to load conversations</p>
            <p className="text-xs text-gray-400 mt-1">{fetchError}</p>
            <button 
              onClick={onRefresh}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <button
                onClick={() => onConversationClick(conversation)}
                className="flex-1 flex items-center gap-3 min-w-0 text-left"
              >
                <Avatar 
                  name={conversation.name}
                  avatarUrl={conversation.avatar}
                  size="md" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conversation.title}</p>
                  <p className={`text-xs truncate mt-1 ${
                    conversation.hasMessages ? 'text-gray-600' : 'text-gray-400 italic'
                  }`}>
                    {conversation.lastMessage}
                  </p>
                </div>
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, conversation)}
                className="shrink-0 text-slate-400 hover:text-red-600 transition-colors p-1"
                title="Delete conversation"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <PiChats className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Start chatting with mentors to see conversations here
            </p>
          </div>
        )}
      </div>
      
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setConversationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation"
        message="Do you want to delete this conversation"
        itemName={conversationToDelete?.name}
      />
    </div>
  );
};

export default ConversationsDropdown;