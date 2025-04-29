import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'default_secret_key'
    ) as { userId: string; email: string };
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    // Verify user exists in database
    const db = mongoose.connection.db;
    if (db) {
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ 
        _id: new mongoose.Types.ObjectId(decoded.userId)
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}; 