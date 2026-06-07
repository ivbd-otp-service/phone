import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

// Check if model already exists (for Next.js hot-reload)
const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);

export default Otp;