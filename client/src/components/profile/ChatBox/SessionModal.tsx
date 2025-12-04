import { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaCalendarAlt, FaClock, FaHourglassHalf } from 'react-icons/fa';

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
              <FaCalendarAlt className="text-sm" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Schedule Session</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg p-2 transition-all"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Session Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              placeholder="e.g., Project Review & Deployment"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <FaCalendarAlt className="text-slate-400" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all cursor-pointer"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <FaClock className="text-slate-400" /> Start Time
              </label>
              <div className="flex shadow-sm rounded-lg overflow-hidden border border-slate-200">
                <input
                  type="number"
                  value={hour}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setHour(Math.min(12, Math.max(1, val)).toString());
                  }}
                  min="1"
                  max="12"
                  className="w-14 px-1 py-2.5 text-sm font-medium text-center text-slate-700 bg-slate-50 focus:bg-white focus:ring-inset focus:ring-2 focus:ring-slate-800 outline-none"
                  placeholder="10"
                />
                <div className="bg-slate-50 flex items-center px-1 text-slate-400 font-bold">:</div>
                <input
                  type="number"
                  value={minute}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setMinute(Math.min(59, Math.max(0, val)).toString().padStart(2, '0'));
                  }}
                  min="0"
                  max="59"
                  className="w-14 px-1 py-2.5 text-sm font-medium text-center text-slate-700 bg-slate-50 focus:bg-white focus:ring-inset focus:ring-2 focus:ring-slate-800 outline-none"
                  placeholder="00"
                />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="flex-1 px-2 py-2.5 text-sm font-medium text-center text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer outline-none border-l border-slate-200"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <FaHourglassHalf className="text-slate-400" /> Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="number"
                  value={durationHours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setDurationHours(Math.max(0, val).toString());
                  }}
                  min="0"
                  className="w-full pl-4 pr-12 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                  HRS
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setDurationMinutes(Math.min(59, Math.max(0, val)).toString());
                  }}
                  min="0"
                  max="59"
                  className="w-full pl-4 pr-12 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                  MINS
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
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