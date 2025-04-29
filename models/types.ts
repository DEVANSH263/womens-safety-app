import { Types } from 'mongoose';

export interface GeoLocation {
  coordinates: [number, number];  // [longitude, latitude]
  timestamp?: Date;
  address?: string;
}

export interface Contact {
  name: string;
  relation: string;
  phone: string;
  email?: string;
  notificationPreference: 'sms' | 'email' | 'both';
}

export interface NotificationStatus {
  contactId: Types.ObjectId;
  notifiedAt: Date;
  responseStatus: 'PENDING' | 'ACKNOWLEDGED' | 'RESPONDING' | 'NOT_AVAILABLE';
  responseTime?: Date;
}

export interface TimeSchedule {
  active: boolean;
  startTime?: string;      // HH:mm format
  endTime?: string;        // HH:mm format
  daysOfWeek?: number[];   // 0-6 (Sunday-Saturday)
}

// Validation helpers
export const validateTimeFormat = (time?: string): boolean => {
  return !time || /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

// Common schema configurations
export const geoLocationSchema = {
  coordinates: {
    type: [Number],
    required: true,
    index: '2dsphere'
  },
  timestamp: Date,
  address: String
};

export const contactSchema = {
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  notificationPreference: {
    type: String,
    enum: ['sms', 'email', 'both'],
    default: 'both'
  }
}; 