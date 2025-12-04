import { FaCalendarAlt, FaClock, FaCheck, FaTimes, FaVideo, FaHourglassHalf, FaFlagCheckered } from 'react-icons/fa';
import type { Booking } from './types';

interface BookingCardProps {
  booking: Booking;
  isSender: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onComplete?: () => void;
}

const BookingCard = ({
  booking,
  isSender,
  onAccept,
  onDecline,
  onComplete
}: BookingCardProps) => {
  const isPending = booking.status === 'pending';
  const isAccepted = booking.status === 'accepted';
  const isDeclined = booking.status === 'declined';
  const isCompleted = booking.status === 'completed';

  const statusConfig = {
    pending: {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: FaHourglassHalf
    },
    accepted: {
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: FaCheck
    },
    completed: {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: FaFlagCheckered
    },
    declined: {
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
      icon: FaTimes
    }
  };

  const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="w-64 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      
      <div className={`h-1 w-full ${isPending ? 'bg-amber-400' : isAccepted ? 'bg-emerald-500' : isCompleted ? 'bg-blue-500' : 'bg-red-400'}`} />

      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${status.bg} ${status.color} ${status.border}`}>
            <StatusIcon className="text-[10px]" />
            {booking.status}
          </span>
        </div>

        <h4 className="font-bold text-slate-800 text-sm mb-3 line-clamp-2 leading-tight">
          {booking.topic}
        </h4>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex flex-col justify-center items-center bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
            <FaCalendarAlt className="text-slate-400 text-xs mb-1" />
            <span className="text-xs font-semibold text-slate-700">
              {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
            <FaClock className="text-slate-400 text-xs mb-1" />
            <span className="text-xs font-semibold text-slate-700">
              {booking.time}
            </span>
            <span className="text-[10px] text-slate-400">{booking.duration} min</span>
          </div>
        </div>

        <div className="space-y-2">
          {isPending && !isSender && (
            <div className="flex gap-2">
              <button
                onClick={onDecline}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-slate-200 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm"
              >
                Accept
              </button>
            </div>
          )}

          {isPending && isSender && (
            <div className="flex items-center justify-center gap-2 py-2 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
              <div className="animate-pulse w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span className="text-xs text-slate-500 italic">Waiting for response...</span>
            </div>
          )}

          {isAccepted && (
            <>
              {booking.meetingLink && (
                <a
                  href={booking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg text-xs font-bold transition-transform active:scale-95"
                >
                  <FaVideo className="text-emerald-400" /> Join Call
                </a>
              )}

              {!isSender && (
                <button
                  onClick={onComplete}
                  className="w-full py-1.5 text-[11px] font-medium text-slate-500 hover:text-blue-600 hover:underline transition-colors"
                >
                  Mark as Completed
                </button>
              )}
            </>
          )}

          {isCompleted && (
            <div className="text-center bg-blue-50 border border-blue-100 py-2 rounded-lg">
              <span className="text-xs text-blue-700 font-medium flex items-center justify-center gap-1">
                 Session Finished
              </span>
            </div>
          )}

          {isDeclined && (
            <div className="text-center bg-slate-50 border border-slate-100 py-2 rounded-lg">
              <span className="text-xs text-slate-400 font-medium">Request was declined</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;