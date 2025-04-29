import { ObjectId } from 'mongodb';

declare namespace Express {
  export interface Request {
    user?: {
      userId: string | ObjectId;
      email: string;
    };
  }
} 