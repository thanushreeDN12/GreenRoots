import mongoose from 'mongoose';

const donationSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', donationSchema);
