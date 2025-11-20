import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'review' | 'booking' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: mongoose.Types.ObjectId;
  reviewId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['review', 'booking', 'system'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor'
  },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);