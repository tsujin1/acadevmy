import { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaCalendarAlt, FaClock, FaHourglass } from 'react-icons/fa';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { topic: string; date: string; time: string; duration: number }) => void;
}

const SessionModal = ({ isOpen, onClose, onSubmit }: SessionModalProps) => {
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const [durationHours, setDurationHours] = useState('0');
  const [durationMinutes, setDurationMinutes] = useState('30');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && date && (parseInt(durationHours) > 0 || parseInt(durationMinutes) > 0)) {
      let militaryHour = parseInt(hour);
      if (period === 'PM' && militaryHour !== 12) militaryHour += 12;
      if (period === 'AM' && militaryHour === 12) militaryHour = 0;
      const time = `${militaryHour.toString().padStart(2, '0')}:${minute}`;
      const duration = (parseInt(durationHours) * 60) + parseInt(durationMinutes);
      
      onSubmit({ topic, date, time, duration });
      setTopic('');
      setDate('');
      setHour('10');
      setMinute('00');
      setPeriod('AM');
      setDurationHours('0');
      setDurationMinutes('30');
      onClose();
    }
  };

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-linear-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-white text-lg" />
            </div>
            <h3 className="font-semibold text-white text-lg">Schedule Session</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
              placeholder="What would you like to discuss?"
              required
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <FaCalendarAlt className="text-gray-400 text-xs" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition cursor-pointer text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <FaClock className="text-gray-400 text-xs" />
              Time
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={hour}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setHour(Math.min(12, Math.max(1, val)).toString());
                }}
                min="1"
                max="12"
                className="flex-1 px-3 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-gray-700 text-center"
                placeholder="HH"
              />
              
              <input
                type="number"
                value={minute}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setMinute(Math.min(59, Math.max(0, val)).toString().padStart(2, '0'));
                }}
                min="0"
                max="59"
                className="flex-1 px-3 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-gray-700 text-center"
                placeholder="MM"
              />
              
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="flex-1 px-3 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition cursor-pointer text-gray-700"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <FaHourglass className="text-gray-400 text-xs" />
              Duration
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={durationHours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setDurationHours(Math.max(0, val).toString());
                  }}
                  min="0"
                  className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-gray-700 text-center"
                  placeholder="Hours"
                />
              </div>
              
              <div className="flex-1">
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setDurationMinutes(Math.min(59, Math.max(0, val)).toString());
                  }}
                  min="0"
                  max="59"
                  className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-gray-700 text-center"
                  placeholder="Minutes"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-lg"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default SessionModal;