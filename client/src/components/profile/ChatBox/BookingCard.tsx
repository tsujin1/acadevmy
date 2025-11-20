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

  const statusColor = isPending ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
    isAccepted ? 'text-green-700 bg-green-50 border-green-200' :
      isCompleted ? 'text-blue-700 bg-blue-50 border-blue-200' :
        'text-red-700 bg-red-50 border-red-200';

  const accentColorClass = isPending ? 'bg-yellow-400' :
    isAccepted ? 'bg-green-500' :
      isCompleted ? 'bg-blue-500' :
        'bg-red-500';

  const StatusIcon = isPending ? FaHourglassHalf :
    isAccepted ? FaCheck :
      isCompleted ? FaFlagCheckered :
        FaTimes;
  const iconColorClass = isPending ? 'text-yellow-500' :
    isAccepted ? 'text-green-500' :
      isCompleted ? 'text-blue-500' :
        'text-red-500';

  return (
    <div className="group relative overflow-hidden rounded-2xl border w-72 transition-all duration-300 shadow-sm hover:shadow-md bg-white border-gray-200">

      <div className={`absolute top-0 left-0 w-1.5 h-full ${accentColorClass}`} />

      <div className="p-4 pl-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <StatusIcon className={`${iconColorClass} text-xs`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColor}`}>
              {booking.status}
            </span>
          </div>
        </div>

        <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{booking.topic}</h4>

        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <FaCalendarAlt className="text-gray-400" />
            <span className="font-medium">{new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <FaClock className="text-gray-400" />
            <span className="font-medium">{booking.time} ({booking.duration}m)</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
          {isPending && !isSender && (
            <div className="flex gap-2">
              <button
                onClick={onDecline}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 transition border border-transparent hover:border-gray-200"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-bold text-white bg-black hover:bg-gray-800 transition shadow-lg shadow-gray-200"
              >
                Accept
              </button>
            </div>
          )}

          {isPending && isSender && (
            <p className="text-center text-xs text-gray-500 italic py-2">
              Waiting for response...
            </p>
          )}

          {isAccepted && (
            <>
              {booking.meetingLink && (
                <a
                  href={booking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 transition-all hover:scale-[1.02]"
                >
                  <FaVideo className="text-green-400" /> Join Meeting
                </a>
              )}

              {!isSender && (
                <button
                  onClick={onComplete}
                  className="w-full py-2 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  Mark as Completed
                </button>
              )}
            </>
          )}

          {isCompleted && (
            <p className="text-center text-xs text-blue-600 font-medium bg-blue-50 py-2 rounded-lg">
              Session Completed
            </p>
          )}

          {isDeclined && (
            <p className="text-center text-xs text-red-600 font-medium bg-red-50 py-2 rounded-lg">
              Request Declined
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;