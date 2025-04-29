import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export function withDatabase(handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      return handler(req, res);
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  };
} 