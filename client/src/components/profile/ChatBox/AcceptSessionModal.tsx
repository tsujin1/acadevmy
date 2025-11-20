import { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaVideo, FaLink } from 'react-icons/fa';

interface AcceptSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (link: string) => void;
}

const AcceptSessionModal = ({ isOpen, onClose, onConfirm }: AcceptSessionModalProps) => {
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const URL_REGEX = /^https?:\/\/.*/i;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!link.trim()) {
      setError('Please enter a meeting link.');
      return;
    }

    if (!URL_REGEX.test(link.trim())) {
      setError('The link must start with http:// or https:// (e.g., https://meet.google.com/...)');
      return;
    }

    onConfirm(link);
    setLink('');
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-9999 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all scale-100">
        
        <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center gap-2">
            <FaVideo className="text-green-400" />
            Setup Meeting
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            To accept this session, please provide a video conferencing link (Google Meet, Zoom, etc).
          </p>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLink className="text-gray-400" />
            </div>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none text-sm transition-all"
              placeholder="https://meet.google.com/..."
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-black transition shadow-lg shadow-gray-200"
            >
              Confirm & Send
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AcceptSessionModal;