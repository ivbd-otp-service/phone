import dbConnect from '@/lib/dbConnect';
import Otp from '@/models/Otp';

export default async function handler(req, res) {
  const { phone } = req.query;

  // Basic phone validation
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required in URL' });
  }

  // Connect to database
  try {
    await dbConnect();
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed' });
  }

  // ----- POST: Save new OTP -----
  if (req.method === 'POST') {
    const { message, msg } = req.body; // support both 'message' and 'msg'
    const otpCode = message || msg;

    if (!otpCode) {
      return res.status(400).json({ error: 'message (or msg) is required in body' });
    }

    try {
      const doc = await Otp.create({
        phone: phone, // from URL
        message: otpCode,
        time: new Date(),
      });

      return res.status(201).json({
        saved: {
          phone: doc.phone,
          message: doc.message,
          time: doc.time,
          _id: doc._id,
          savedAt: doc.time,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save OTP', details: error.message });
    }
  }

  // ----- GET: Retrieve latest OTP for this number -----
  if (req.method === 'GET') {
    try {
      const latest = await Otp.findOne({ phone }).sort({ time: -1 }).exec();

      if (!latest) {
        return res.status(404).json({ error: 'No OTP found for this phone number' });
      }

      return res.status(200).json({
        phone: latest.phone,
        message: latest.message,
        time: latest.time,
        _id: latest._id,
        savedAt: latest.time,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch OTP', details: error.message });
    }
  }

  // ----- Other methods not allowed -----
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}