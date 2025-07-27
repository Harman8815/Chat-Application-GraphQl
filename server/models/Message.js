import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: function () {
      return !this.attachments || this.attachments.length === 0;
    },
    trim: true
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, default: null },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
}, { timestamps: true });

messageSchema.index({ roomId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
