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
      setError('Link must start with http:// or https://');
      return;
    }

    onConfirm(link);
    setLink('');
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
              <FaVideo className="text-sm" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Confirm Session</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg p-2 transition-all"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            To accept this request, please provide a valid video conferencing link (e.g., Google Meet, Zoom).
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Meeting Link</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLink className="text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              </div>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${
                  error ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-slate-200'
                }`}
                placeholder="https://meet.google.com/..."
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs font-medium animate-pulse">{error}</p>}
          </div>

          <div className="flex gap-3 mt-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-200 transition-all active:scale-[0.98]"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AcceptSessionModal;