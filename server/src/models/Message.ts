import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  roomId: string;
  senderId: string;
  senderType: 'user' | 'mentor';
  text?: string;
  type: 'text' | 'booking';
  booking?: {
    id: string;
    topic: string;
    date: string;
    time: string;
    duration: number;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    meetingLink?: string;
  };
  isRead: boolean;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  roomId: { type: String, required: true, index: true },
  senderId: { type: String, required: true, index: true },
  senderType: { type: String, enum: ['user', 'mentor'], required: true },
  text: { type: String },
  type: { type: String, enum: ['text', 'booking'], default: 'text' },
  booking: {
    id: String,
    topic: String,
    date: String,
    time: String,
    duration: Number,
    status: { type: String, default: 'pending' },
    meetingLink: String
  },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

MessageSchema.index({ roomId: 1, timestamp: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);