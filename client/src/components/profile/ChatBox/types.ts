export interface Booking {
  id: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  meetingLink?: string;
}

export interface SocketMessage {
  id: string;
  text?: string;
  sender: 'user' | 'mentor';
  timestamp: string;
  userId?: string;
  socketId?: string;
  isRead?: boolean;
  type?: 'text' | 'booking';
  booking?: Booking;
}