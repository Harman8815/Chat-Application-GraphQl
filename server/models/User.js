import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  bio: { type: String },
  lastOnline: { type: Date },
  isOnline: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notificationsEnabled: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
